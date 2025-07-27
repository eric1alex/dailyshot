// server.js (All-in-One version)

// 1. Import Dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// --- Import the Model directly ---
const Challenge = require('./models/challengeModel');

// 2. Initialize the App & PORT
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 4. Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // To parse JSON bodies

// ==========================================================
// 5. API ROUTES (Defined Directly Here)
// ==========================================================

// --- Public Route to Get Active Challenge ---
app.get('/api/challenge/active', async (req, res) => {
  try {
    const activeChallenge = await Challenge.findOne({ isActive: true });
    if (!activeChallenge) {
      return res.status(404).json({ msg: 'No active challenge found.' });
    }
    res.json(activeChallenge);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- Admin Route to Create a New Challenge ---
app.post('/api/admin/challenge', async (req, res) => {
    const { title, description, hashtag, secretKey } = req.body;

    // --- NEW: Add these two lines for debugging ---
    console.log('--- Secret Key Check ---');
    console.log(`Key from Form:   '${secretKey}'`);
    console.log(`Key from .env:   '${process.env.ADMIN_SECRET_KEY}'`);

    // Security Check
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid secret key.' });
    }
    // Input Validation
    if (!title || !description || !hashtag) {
        return res.status(400).json({ msg: 'Please provide title, description, and hashtag.' });
    }
    try {
        await Challenge.findOneAndUpdate({ isActive: true }, { isActive: false });
        const newChallenge = new Challenge({
            title,
            description,
            submissionHashtag: hashtag,
            isActive: true
        });
        await newChallenge.save();
        res.json({ msg: 'Success! New challenge is live.' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ==========================================================

// 6. Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});