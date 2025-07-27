// testDb.js
require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('./models/challengeModel');

const runTest = async () => {
  console.log('Attempting to connect to MongoDB...');
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ FATAL: MONGO_URI not found in .env file.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected.');

    console.log('\nSearching for active challenge...');
    const activeChallenge = await Challenge.findOne({ isActive: true });

    if (activeChallenge) {
      console.log('✅ SUCCESS: Found the active challenge!');
      console.log(activeChallenge);
    } else {
      console.log('❌ FAILED: Query ran successfully but found no document with isActive: true.');
    }

  } catch (error) {
    console.error('❌ An error occurred during the test:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
};

runTest();