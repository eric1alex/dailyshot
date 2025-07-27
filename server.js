// server.js (Final version with checks)

const fs = require('fs'); // Built-in Node.js module for file system
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

// --- PRE-FLIGHT CHECKS ---
// Check 1: Does the .env file exist?
const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('----------------------------------------------------');
    console.error('❌ FATAL ERROR: The .env file is missing.');
    console.error('Please create a file named ".env" in the root of your project.');
    console.error('----------------------------------------------------');
    process.exit(1); // Stop the application
}

// If the file exists, THEN load it.
require('dotenv').config();

// Check 2: Is the MONGO_URI variable loaded from the .env file?
if (!process.env.MONGO_URI) {
    console.error('----------------------------------------------------');
    console.error('❌ FATAL ERROR: The MONGO_URI variable was not found.');
    console.error('Please make sure your .env file contains a line like:');
    console.error('MONGO_URI=mongodb+srv://user:password@cluster...');
    console.error('----------------------------------------------------');
    process.exit(1); // Stop the application
}
// --- END OF CHECKS ---


// --- Now we can safely proceed ---
const app = express();
const PORT = process.env.PORT || 3000;
const Challenge = require('./models/challengeModel');

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
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});