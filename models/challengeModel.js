// models/challengeModel.js

const mongoose = require('mongoose');

// Define the schema (the blueprint) for a challenge
const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  submissionHashtag: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// This is the crucial line. It creates the model from the schema
// and exports it so other files can use it.
module.exports = mongoose.model('Challenge', challengeSchema);