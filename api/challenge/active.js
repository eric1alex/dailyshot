// api/challenge/active.js
console.log('--- API Function Cold Start ---');
console.log('Attempting to load environment variables...');

// Log the URI to see if Vercel is loading it
console.log('MONGO_URI found:', !!process.env.MONGO_URI); // This will be true or false

const mongoose = require('mongoose');
const Challenge = require('../../models/challengeModel');

// Establish a connection that we can reuse
let isConnected;
const connectToDatabase = async () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return;
    }
    console.log('=> using new database connection');
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
};


module.exports = async (req, res) => {
    console.log('--- Received a request ---');
    try {
        await connectToDatabase();
        console.log('Database connection successful.');

        const activeChallenge = await Challenge.findOne({ isActive: true });
        console.log('Query executed.');

        if (!activeChallenge) {
            console.log('No active challenge found in database.');
            return res.status(404).json({ msg: 'No active challenge found.' });
        }

        console.log('Active challenge found, sending response.');
        return res.status(200).json(activeChallenge);

    } catch (error) {
        console.error('--- A FATAL ERROR OCCURRED ---');
        console.error(error.message);
        return res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};