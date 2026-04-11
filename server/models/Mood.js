const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mood: {
        type: String,
        enum: ["happy", "sad", "anxious", "calm", "angry", "neutral"],
        required: true
    },
    energy: {
        type: String,
        enum: ["high", "low"],
        required: true
    },
    intensity: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    note: String
}, {
    timestamps: true   // ✅ gives createdAt automatically
});

module.exports = mongoose.model("Mood", moodSchema);