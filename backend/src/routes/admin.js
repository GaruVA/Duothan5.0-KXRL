const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const authenticateToken = require('../middleware/auth');
const Team = require('../models/Team');
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

// @route   GET /api/admin/teams
// @desc    Get all teams (admin only)
// @access  Private (Admin only)
router.get('/teams', async (req, res) => {
  try {
    const teams = await Team.find({}).select('-password');
    res.json({ teams });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (legacy route)
// @access  Private (Admin only)
router.get('/users', (req, res) => {
  res.json({ message: 'Get all users route - use /teams instead' });
});

// @route   GET /api/admin/challenges
// @desc    Get all challenges (admin view)
// @access  Private (Admin only)
router.get('/challenges', (req, res) => {
  res.json({ message: 'Get all challenges (admin) route' });
});

// @route   POST /api/admin/challenges
// @desc    Create a new challenge
// @access  Private (Admin only)
router.post('/challenges', (req, res) => {
  res.json({ message: 'Create challenge route' });
});

// @route   PUT /api/admin/challenges/:id
// @desc    Update a challenge
// @access  Private (Admin only)
router.put('/challenges/:id', (req, res) => {
  res.json({ message: 'Update challenge route' });
});

// @route   DELETE /api/admin/challenges/:id
// @desc    Delete a challenge
// @access  Private (Admin only)
router.delete('/challenges/:id', (req, res) => {
  res.json({ message: 'Delete challenge route' });
});

module.exports = router;
