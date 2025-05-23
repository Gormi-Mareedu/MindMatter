const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Journal = require('../models/Journal');
const verifyToken = require('../middleware/verifyToken');

// POST: Create a journal entry
router.post(
  '/',
  verifyToken,
  [
    body('title')
      .isString()
      .trim()
      .escape()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('content')
      .isString()
      .trim()
      .escape()
      .isLength({ min: 5, max: 2000 })
      .withMessage('Content must be between 5 and 2000 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content } = req.body;

      const newJournal = new Journal({
        title,
        content,
        user: req.user.id,
      });

      const savedJournal = await newJournal.save();

      res.status(201).json({
        message: 'Journal saved to MongoDB!',
        journal: savedJournal,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while saving journal' });
    }
  }
);

// GET: All journal entries for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching journals' });
  }
});

// PUT: Update a journal entry
router.put(
  '/:id',
  verifyToken,
  [
    body('title')
      .optional()
      .isString()
      .trim()
      .escape()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('content')
      .optional()
      .isString()
      .trim()
      .escape()
      .isLength({ min: 5, max: 2000 })
      .withMessage('Content must be between 5 and 2000 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const journal = await Journal.findOne({ _id: req.params.id, user: req.user.id });
      if (!journal) return res.status(404).json({ message: 'Journal not found' });

      journal.title = req.body.title || journal.title;
      journal.content = req.body.content || journal.content;

      const updatedJournal = await journal.save();
      res.json(updatedJournal);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while updating journal' });
    }
  }
);

// DELETE: Remove a journal
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!journal) return res.status(404).json({ message: 'Journal not found' });

    res.json({ message: 'Journal deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting journal' });
  }
});

module.exports = router;
