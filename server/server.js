const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// test route
app.get("/", (req, res) => {
    res.send("API running");
});
app.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to dashboard" });
});

app.get("/getMoods", authMiddleware, async (req, res) => {
    try {
        const moods = await Mood.find({ userId: req.user.id });
        res.json(moods);
    } catch (error) {
        res.status(500).json({ message: "Error fetching moods" });
    }
});
// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
const User = require("./models/User");

// REGISTER API
const bcrypt = require("bcryptjs");

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 🔥 CREATE TOKEN
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

const Mood = require("./models/Mood");

app.post("/addMood", authMiddleware, async (req, res) => {
    try {
        const { mood, note } = req.body;

        const newMood = new Mood({
            userId: req.user.id,
            mood,
            note
        });

        await newMood.save();

        res.json({ message: "Mood saved" });

    } catch (error) {
        res.status(500).json({ message: "Error saving mood" });
    }
});

app.delete("/deleteMood/:id", authMiddleware, async (req, res) => {
    try {
        const moodId = req.params.id;

        await Mood.findByIdAndDelete(moodId);

        res.json({ message: "Mood deleted" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting mood" });
    }
});

app.put("/updateMood/:id", authMiddleware, async (req, res) => {
    try {
        const moodId = req.params.id;
        const { mood, note } = req.body;

        await Mood.findByIdAndUpdate(moodId, {
            mood,
            note
        });

        res.json({ message: "Mood updated" });

    } catch (error) {
        res.status(500).json({ message: "Error updating mood" });
    }
});