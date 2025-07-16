const express = require('express');
const router = express.Router();

// @route   GET /api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Get all challenges route' });
});

// @route   GET /api/challenges/:id
// @desc    Get challenge by ID
// @access  Public
router.get('/:id', (req, res) => {
  res.json({ message: 'Get challenge by ID route' });
});

// @route   GET /api/challenges/category/:category
// @desc    Get challenges by category
// @access  Public
router.get('/category/:category', (req, res) => {
  res.json({ message: 'Get challenges by category route' });
});

// @route   GET /api/challenges/difficulty/:difficulty
// @desc    Get challenges by difficulty
// @access  Public
router.get('/difficulty/:difficulty', (req, res) => {
  res.json({ message: 'Get challenges by difficulty route' });
});

module.exports = router;
