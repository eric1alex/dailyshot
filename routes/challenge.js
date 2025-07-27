// routes/challenge.js

const express = require('express');
const router = express.Router();
const Challenge = require('../models/challengeModel');

// @route   GET /api/challenge/active
// @desc    Get the single active challenge
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const activeChallenge = await Challenge.findOne({ isActive: true });

    if (!activeChallenge) {
      return res.status(404).json({ msg: 'No active challenge found.' });
    }

    res.json(activeChallenge);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;