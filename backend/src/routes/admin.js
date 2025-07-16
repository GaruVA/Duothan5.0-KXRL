const express = require('express');
const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', (req, res) => {
  res.json({ message: 'Get all users route' });
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
