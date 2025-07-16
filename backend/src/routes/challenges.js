const express = require('express');
const authenticateToken = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const Judge0Service = require('../services/judge0Service');
const router = express.Router();

const judge0 = new Judge0Service();

// @route   GET /api/challenges
// @desc    Get all challenges
// @access  Private (requires authentication)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      difficulty, 
      category, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { isActive: true };

    // Apply filters
    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (category) {
      query.category = new RegExp(category, 'i');
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const challenges = await Challenge.find(query)
      .select('-testCases') // Exclude test cases from list view
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get submission status for each challenge for the current team
    const challengesWithStatus = await Promise.all(
      challenges.map(async (challenge) => {
        const bestSubmission = await Submission.getBestScore(req.team._id, challenge._id);
        const latestSubmission = await Submission.getLatestSubmission(req.team._id, challenge._id);
        
        return {
          ...challenge,
          userStatus: {
            bestScore: bestSubmission?.score || 0,
            isSolved: bestSubmission?.isCorrect || false,
            attemptCount: await Submission.countDocuments({
              teamId: req.team._id,
              challengeId: challenge._id
            }),
            lastAttempt: latestSubmission?.createdAt || null
          }
        };
      })
    );

    const total = await Challenge.countDocuments(query);

    res.json({
      challenges: challengesWithStatus,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalChallenges: total,
      team: req.team.teamName
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ 
      error: 'Failed to get challenges',
      message: error.message 
    });
  }
});

// @route   GET /api/challenges/:id
// @desc    Get challenge by ID
// @access  Private (requires authentication)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (!challenge.isActive) {
      return res.status(400).json({ error: 'Challenge is not active' });
    }

    // Get user's submission history for this challenge
    const userSubmissions = await Submission.find({
      teamId: req.team._id,
      challengeId: req.params.id
    })
    .select('status score isCorrect createdAt finishedAt time memory')
    .sort({ createdAt: -1 })
    .limit(5);

    // Get best submission
    const bestSubmission = await Submission.getBestScore(req.team._id, req.params.id);

    // Get challenge statistics
    const stats = await Submission.getChallengeStats(req.params.id);

    // Remove hidden test cases from response
    const publicChallenge = challenge.toObject();
    publicChallenge.testCases = challenge.getPublicTestCases();

    res.json({
      challenge: publicChallenge,
      userStatus: {
        bestScore: bestSubmission?.score || 0,
        isSolved: bestSubmission?.isCorrect || false,
        recentSubmissions: userSubmissions,
        attemptCount: userSubmissions.length
      },
      statistics: stats,
      team: req.team.teamName
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ 
      error: 'Failed to get challenge',
      message: error.message 
    });
  }
});

// @route   GET /api/challenges/category/:category
// @desc    Get challenges by category
// @access  Private (requires authentication)
router.get('/category/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, difficulty } = req.query;

    let query = { 
      category: new RegExp(category, 'i'),
      isActive: true 
    };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const challenges = await Challenge.find(query)
      .select('-testCases')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Challenge.countDocuments(query);

    res.json({
      challenges,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalChallenges: total,
      category,
      team: req.team.teamName
    });
  } catch (error) {
    console.error('Get challenges by category error:', error);
    res.status(500).json({ 
      error: 'Failed to get challenges by category',
      message: error.message 
    });
  }
});

// @route   GET /api/challenges/difficulty/:difficulty
// @desc    Get challenges by difficulty
// @access  Private (requires authentication)
router.get('/difficulty/:difficulty', authenticateToken, async (req, res) => {
  try {
    const { difficulty } = req.params;
    const { page = 1, limit = 10, category } = req.query;

    let query = { 
      difficulty,
      isActive: true 
    };

    if (category) {
      query.category = new RegExp(category, 'i');
    }

    const challenges = await Challenge.find(query)
      .select('-testCases')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Challenge.countDocuments(query);

    res.json({
      challenges,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalChallenges: total,
      difficulty,
      team: req.team.teamName
    });
  } catch (error) {
    console.error('Get challenges by difficulty error:', error);
    res.status(500).json({ 
      error: 'Failed to get challenges by difficulty',
      message: error.message 
    });
  }
});

// @route   GET /api/challenges/:id/leaderboard
// @desc    Get leaderboard for a specific challenge
// @access  Private (requires authentication)
router.get('/:id/leaderboard', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;

    // Get best submissions for each team for this challenge
    const leaderboard = await Submission.aggregate([
      {
        $match: {
          challengeId: new require('mongoose').Types.ObjectId(id),
          isCorrect: true
        }
      },
      {
        $sort: {
          score: -1,
          createdAt: 1 // Earlier submission wins if tied
        }
      },
      {
        $group: {
          _id: '$teamId',
          bestSubmission: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$bestSubmission' }
      },
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team'
        }
      },
      {
        $unwind: '$team'
      },
      {
        $project: {
          teamName: '$team.teamName',
          score: 1,
          time: 1,
          memory: 1,
          createdAt: 1,
          finishedAt: 1
        }
      },
      {
        $sort: {
          score: -1,
          createdAt: 1
        }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      leaderboard,
      challengeId: id
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ 
      error: 'Failed to get leaderboard',
      message: error.message 
    });
  }
});

// @route   GET /api/challenges/languages
// @desc    Get available programming languages
// @access  Private (requires authentication)
router.get('/meta/languages', authenticateToken, async (req, res) => {
  try {
    const languages = await judge0.getLanguages();
    res.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ 
      error: 'Failed to get programming languages',
      message: error.message 
    });
  }
});

// @route   GET /api/challenges/judge0/status
// @desc    Get Judge0 system status
// @access  Private (requires authentication)
router.get('/meta/judge0-status', authenticateToken, async (req, res) => {
  try {
    const [systemInfo, configInfo, testResult] = await Promise.all([
      judge0.getSystemInfo().catch(() => null),
      judge0.getConfigInfo().catch(() => null),
      judge0.testConnection()
    ]);

    res.json({
      connectionTest: testResult,
      systemInfo,
      configInfo
    });
  } catch (error) {
    console.error('Get Judge0 status error:', error);
    res.status(500).json({ 
      error: 'Failed to get Judge0 status',
      message: error.message 
    });
  }
});

module.exports = router;
