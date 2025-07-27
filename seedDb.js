// seedDb.js
require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('./models/challengeModel');

const seedDatabase = async () => {
  console.log('Attempting to connect to MongoDB...');
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ FATAL: MONGO_URI not found in .env file.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected.');

    console.log('\nAttempting to delete old challenges...');
    await Challenge.deleteMany({}); // Deletes all documents
    console.log('✅ Old challenges cleared.');

    console.log('\nAttempting to insert new challenge...');
    const newChallenge = new Challenge({
      title: "Leading Lines",
      description: "Find and use strong lines (roads, fences, shadows) to guide the viewer's eye through your photo.",
      submissionHashtag: "#DailyFrameLines", // Corrected this line
      isActive: true                        // Corrected this line
    });
    await newChallenge.save();
    console.log('✅ New active challenge has been created successfully!');

  } catch (error) {
    console.error('❌ An error occurred during the seeding process:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
};

seedDatabase();