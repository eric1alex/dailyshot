// server.js (Production Ready)

require('dotenv').config(); // This loads variables for local dev, but Render provides them automatically
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Challenge = require('./models/challengeModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected...'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API Routes
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

app.post('/api/admin/challenge', async (req, res) => {
    const { title, description, hashtag, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid secret key.' });
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

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});