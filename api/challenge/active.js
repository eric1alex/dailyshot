// api/challenge/active.js
const mongoose = require('mongoose');
const Challenge = require('../../models/challengeModel');

// Connect to the database
mongoose.connect(process.env.MONGO_URI);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const activeChallenge = await Challenge.findOne({ isActive: true });
        if (!activeChallenge) {
            return res.status(404).json({ msg: 'No active challenge found.' });
        }
        res.status(200).json(activeChallenge);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};