// api/admin/challenge.js
const mongoose = require('mongoose');
const Challenge = require('../../models/challengeModel'); // Note the path change

// Connect to the database
mongoose.connect(process.env.MONGO_URI);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { title, description, hashtag, secretKey } = req.body;

    // Security Check
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
        res.status(200).json({ msg: 'Success! New challenge is live.' });

    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};