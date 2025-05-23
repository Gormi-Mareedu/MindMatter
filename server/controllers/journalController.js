const Journal = require('../models/Journal');

exports.createJournal = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const journal = new Journal({
      user: req.user.id,
      content,
    });

    await journal.save();

    res.status(201).json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
