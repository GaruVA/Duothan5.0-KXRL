const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const authenticateToken = require('../middleware/auth');
const Team = require('../models/Team');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', adminAuth, (req, res) => {
  res.json({ 
    message: 'Admin login successful',
    admin: { email: process.env.ADMIN_EMAIL }
  });
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const [teamCount, challengeCount, submissionCount, recentSubmissions] = await Promise.all([
      Team.countDocuments(),
      Challenge.countDocuments({ isActive: true }),
      Submission.countDocuments(),
      Submission.find()
        .populate('teamId', 'teamName')
        .populate('challengeId', 'title')
        .sort({ submittedAt: -1 })
        .limit(10)
    ]);

    // Get leaderboard data
    const leaderboard = await Team.aggregate([
      {
        $lookup: {
          from: 'submissions',
          localField: '_id',
          foreignField: 'teamId',
          as: 'submissions'
        }
      },
      {
        $addFields: {
          totalSubmissions: { $size: '$submissions' },
          solvedChallenges: {
            $size: {
              $filter: {
                input: '$submissions',
                cond: { $eq: ['$$this.verdict', 'accepted'] }
              }
            }
          }
        }
      },
      {
        $project: {
          teamName: 1,
          email: 1,
          totalSubmissions: 1,
          solvedChallenges: 1,
          points: { $multiply: ['$solvedChallenges', 100] }
        }
      },
      { $sort: { points: -1, solvedChallenges: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: {
        totalTeams: teamCount,
        activeChallenges: challengeCount,
        totalSubmissions: submissionCount,
        recentSubmissions: recentSubmissions
      },
      leaderboard
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// @route   GET /api/admin/teams
// @desc    Get all teams with pagination and search
// @access  Private (Admin only)
router.get('/teams', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { teamName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      };
    }

    const [teams, total] = await Promise.all([
      Team.find(query)
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Team.countDocuments(query)
    ]);

    // Get submission count for each team
    const teamsWithStats = await Promise.all(
      teams.map(async (team) => {
        const submissions = await Submission.countDocuments({ teamId: team._id });
        const solvedChallenges = await Submission.countDocuments({ 
          teamId: team._id, 
          verdict: 'accepted' 
        });
        
        return {
          ...team.toObject(),
          totalSubmissions: submissions,
          solvedChallenges,
          points: solvedChallenges * 100
        };
      })
    );

    res.json({
      teams: teamsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Teams fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
});

// @route   GET /api/admin/teams/:id/submissions
// @desc    Get team's submission history
// @access  Private (Admin only)
router.get('/teams/:id/submissions', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      Submission.find({ teamId: id })
        .populate('challengeId', 'title difficulty')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ submittedAt: -1 }),
      Submission.countDocuments({ teamId: id })
    ]);

    res.json({
      submissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Team submissions fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch team submissions' });
  }
});

// @route   GET /api/admin/teams/:id
// @desc    Get single team with detailed information
// @access  Private (Admin only)
router.get('/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).select('-password');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get team statistics
    const [totalSubmissions, solvedChallenges, submissions] = await Promise.all([
      Submission.countDocuments({ teamId: req.params.id }),
      Submission.countDocuments({ teamId: req.params.id, isCorrect: true }),
      Submission.find({ teamId: req.params.id })
        .populate('challengeId', 'title difficulty')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    const teamData = {
      ...team.toObject(),
      totalSubmissions,
      solvedChallenges,
      points: solvedChallenges * 100,
      recentSubmissions: submissions
    };

    res.json(teamData);
  } catch (error) {
    console.error('Team fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// @route   PUT /api/admin/teams/:id
// @desc    Update team information
// @access  Private (Admin only)
router.put('/teams/:id', async (req, res) => {
  try {
    const { teamName, email, members, isActive } = req.body;
    
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { teamName, email, members, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    console.error('Team update error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Team name or email already exists' });
    }
    res.status(500).json({ message: 'Failed to update team' });
  }
});

// @route   DELETE /api/admin/teams/:id
// @desc    Delete team and all related data
// @access  Private (Admin only)
router.delete('/teams/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Delete all submissions by this team
    await Submission.deleteMany({ teamId: req.params.id });

    res.json({ message: 'Team and all related data deleted successfully' });
  } catch (error) {
    console.error('Team deletion error:', error);
    res.status(500).json({ message: 'Failed to delete team' });
  }
});

// @route   POST /api/admin/teams/:id/toggle-status
// @desc    Toggle team active status
// @access  Private (Admin only)
router.post('/teams/:id/toggle-status', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.isActive = !team.isActive;
    await team.save();

    const teamData = team.toObject();
    delete teamData.password;

    res.json({
      message: `Team ${team.isActive ? 'activated' : 'deactivated'} successfully`,
      team: teamData
    });
  } catch (error) {
    console.error('Team toggle error:', error);
    res.status(500).json({ message: 'Failed to toggle team status' });
  }
});

// @route   POST /api/admin/teams
// @desc    Create new team (manual team creation by admin)
// @access  Private (Admin only)
router.post('/teams', async (req, res) => {
  try {
    const { teamName, email, password, members } = req.body;
    
    // Check if team already exists
    const existingTeam = await Team.findOne({
      $or: [{ teamName }, { email }]
    });
    
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name or email already exists' });
    }

    const team = new Team({
      teamName,
      email,
      password,
      members: members || [],
      isActive: true
    });

    await team.save();

    const teamData = team.toObject();
    delete teamData.password;

    res.status(201).json({
      message: 'Team created successfully',
      team: teamData
    });
  } catch (error) {
    console.error('Team creation error:', error);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// CHALLENGE MANAGEMENT ROUTES

// @route   GET /api/admin/challenges
// @desc    Get all challenges with pagination and search
// @access  Private (Admin only)
router.get('/challenges', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', difficulty = '', isActive = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }
    if (difficulty) query.difficulty = difficulty;
    if (isActive !== '') query.isActive = isActive === 'true';

    const [challenges, total] = await Promise.all([
      Challenge.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Challenge.countDocuments(query)
    ]);

    res.json({
      challenges,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Challenges fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch challenges' });
  }
});

// @route   GET /api/admin/challenges/:id
// @desc    Get single challenge
// @access  Private (Admin only)
router.get('/challenges/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Challenge fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch challenge' });
  }
});

// @route   POST /api/admin/challenges
// @desc    Create new challenge
// @access  Private (Admin only)
router.post('/challenges', async (req, res) => {
  try {
    const challengeData = {
      ...req.body,
      authorId: '60d0fe4f5311236168a109ca' // Default admin ID
    };

    const challenge = new Challenge(challengeData);
    await challenge.save();

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge
    });
  } catch (error) {
    console.error('Challenge creation error:', error);
    res.status(500).json({ message: 'Failed to create challenge' });
  }
});

// @route   PUT /api/admin/challenges/:id
// @desc    Update challenge
// @access  Private (Admin only)
router.put('/challenges/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({
      message: 'Challenge updated successfully',
      challenge
    });
  } catch (error) {
    console.error('Challenge update error:', error);
    res.status(500).json({ message: 'Failed to update challenge' });
  }
});

// @route   DELETE /api/admin/challenges/:id
// @desc    Delete challenge
// @access  Private (Admin only)
router.delete('/challenges/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Also delete related submissions
    await Submission.deleteMany({ challengeId: req.params.id });

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Challenge deletion error:', error);
    res.status(500).json({ message: 'Failed to delete challenge' });
  }
});

// @route   POST /api/admin/challenges/:id/toggle-status
// @desc    Toggle challenge active status
// @access  Private (Admin only)
router.post('/challenges/:id/toggle-status', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    challenge.isActive = !challenge.isActive;
    await challenge.save();

    res.json({
      message: `Challenge ${challenge.isActive ? 'activated' : 'deactivated'} successfully`,
      challenge
    });
  } catch (error) {
    console.error('Challenge toggle error:', error);
    res.status(500).json({ message: 'Failed to toggle challenge status' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (legacy route)
// @access  Private (Admin only)
router.get('/users', (req, res) => {
  res.json({ message: 'Get all users route - use /teams instead' });
});

module.exports = router;
