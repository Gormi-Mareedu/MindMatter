const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  mood: {
    type: String,
    required: true,
    enum: ['Happy', 'Sad', 'Anxious', 'Angry', 'Excited', 'Neutral'],
  },
  note: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
