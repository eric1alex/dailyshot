// update-local.js
require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('./models/challengeModel');
const challenges = require('./challenges.json');
const fs = require('fs').promises;
const path = require('path');

// We'll create a simple file to store the index of the last used challenge
const lastIndexDbPath = path.resolve(__dirname, 'lastChallengeIndex.txt');

const runUpdater = async () => {
    console.log('--- Challenge Updater Script ---');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database Connected.');

    try {
        // Get the index of the last challenge we used
        let lastIndex = -1;
        try {
            lastIndex = parseInt(await fs.readFile(lastIndexDbPath, 'utf-8'));
        } catch (e) {
            console.log('No previous index found. Starting from the beginning.');
            lastIndex = -1;
        }

        // Figure out the next challenge index (loops back to the start)
        const nextIndex = (lastIndex + 1) % challenges.length;
        const nextChallengeData = challenges[nextIndex];

        console.log(`Setting new active challenge: "${nextChallengeData.title}"`);

        // 1. Deactivate the old challenge
        await Challenge.findOneAndUpdate({ isActive: true }, { isActive: false });

        // 2. Create and save the new active challenge
        const newChallenge = new Challenge({
            ...nextChallengeData,
            isActive: true
        });
        await newChallenge.save();

        // 3. Save the new index for next time
        await fs.writeFile(lastIndexDbPath, nextIndex.toString());

        console.log('✅ Success! Database has been updated.');

    } catch (error) {
        console.error('❌ An error occurred:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Database Disconnected.');
    }
};

runUpdater();