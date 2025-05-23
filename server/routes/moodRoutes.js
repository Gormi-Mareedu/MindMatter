const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');
const verifyToken = require('../middleware/verifyToken');

// POST: Add a new mood entry for logged-in user
router.post(
  '/',
  verifyToken,
  [
    body('mood')
      .isString()
      .isLength({ min: 2 })
      .withMessage('Mood is required and must be at least 2 characters'),
    body('note')
      .optional()
      .isString()
      .trim()
      .escape()
      .isLength({ max: 300 })
      .withMessage('Note should be under 300 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { mood, note } = req.body;

      const newEntry = new MoodEntry({
        mood,
        note,
        user: req.user.id,
      });

      const savedEntry = await newEntry.save();
      res.status(201).json(savedEntry);
    } catch (err) {
      console.error('Error saving mood entry:', err);
      res.status(500).json({ message: 'Server error while saving mood entry' });
    }
  }
);

// GET: Mood insights (count of each mood)
router.get('/insights', verifyToken, async (req, res) => {
  try {
    const result = await MoodEntry.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    console.error('Error generating insights:', err);
    res.status(500).json({ message: 'Error generating mood insights' });
  }
});

module.exports = router;
