const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Journal = require('../models/Journal');
const MoodEntry = require('../models/MoodEntry');
const verifyToken = require('../middleware/verifyToken');

// Middleware to check admin status
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (err) {
    console.error('Admin verification error:', err);
    res.status(500).json({ message: 'Server error verifying admin' });
  }
};

// GET: Admin analytics dashboard
router.get('/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const journalCount = await Journal.countDocuments();
    const moodCount = await MoodEntry.countDocuments();

    const moodStats = await MoodEntry.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    res.json({
      totalUsers: userCount,
      totalJournals: journalCount,
      totalMoodEntries: moodCount,
      mostCommonMood: moodStats[0]?._id || 'N/A',
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ message: 'Error fetching admin data' });
  }
});

module.exports = router;
