const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/challenges
// @desc    Get all challenges
// @access  Private (requires authentication)
router.get('/', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Get all challenges route',
    team: req.team.teamName 
  });
});

// @route   GET /api/challenges/:id
// @desc    Get challenge by ID
// @access  Private (requires authentication)
router.get('/:id', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Get challenge by ID route',
    challengeId: req.params.id,
    team: req.team.teamName 
  });
});

// @route   GET /api/challenges/category/:category
// @desc    Get challenges by category
// @access  Private (requires authentication)
router.get('/category/:category', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Get challenges by category route',
    category: req.params.category,
    team: req.team.teamName 
  });
});

// @route   GET /api/challenges/difficulty/:difficulty
// @desc    Get challenges by difficulty
// @access  Private (requires authentication)
router.get('/difficulty/:difficulty', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Get challenges by difficulty route',
    difficulty: req.params.difficulty,
    team: req.team.teamName 
  });
});

module.exports = router;
