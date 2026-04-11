const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  userId: String,
  text: String,
  analysis: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Journal", journalSchema);