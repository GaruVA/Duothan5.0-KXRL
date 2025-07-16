const express = require('express');
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new team
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { teamName, email, password, members } = req.body;

    // Validation
    if (!teamName || !email || !password) {
      return res.status(400).json({ message: 'Team name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ 
      $or: [{ teamName }, { email }] 
    });

    if (existingTeam) {
      return res.status(400).json({ 
        message: existingTeam.teamName === teamName ? 
          'Team name already exists' : 
          'Email already registered' 
      });
    }

    // Create new team
    const team = new Team({
      teamName,
      email,
      password,
      members: members || []
    });

    await team.save();

    // Generate JWT token
    const token = jwt.sign(
      { teamId: team._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Team registered successfully',
      token,
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        members: team.members
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login team
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find team by email
    const team = await Team.findOne({ email });
    if (!team) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await team.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if team is active
    if (!team.isActive) {
      return res.status(401).json({ message: 'Team account is deactivated' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { teamId: team._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      team: {
        id: team._id,
        teamName: team.teamName,
        email: team.email,
        members: team.members
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current team
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      team: {
        id: req.team._id,
        teamName: req.team.teamName,
        email: req.team.email,
        members: req.team.members
      }
    });
  } catch (error) {
    console.error('Get current team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout team (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
