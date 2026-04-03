const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    userId: String,
    mood: String,
    note: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Mood", moodSchema);