const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Mood = require("./models/Mood");
const Journal = require("./models/Journal");

require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= AUTH =================
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ================= ROUTES =================
app.get("/", (req, res) => res.send("API running"));
app.get("/weeklyReport", authMiddleware, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  const moodScore = {
    happy: 5,
    calm: 4,
    neutral: 3,
    sad: 2,
    anxious: 1,
    angry: 1
  };

  const last7 = moods.slice(0, 7);
  const prev7 = moods.slice(7, 14);

  const avg = arr =>
    arr.length === 0
      ? 0
      : arr.reduce((sum, m) => sum + (moodScore[m.mood] || 3), 0) / arr.length;

  const currentAvg = avg(last7);
  const prevAvg = avg(prev7);

  let improvement = 0;
  if (prevAvg !== 0) {
    improvement = ((currentAvg - prevAvg) / prevAvg) * 100;
  }

  res.json({
    currentAvg,
    prevAvg,
    improvement: improvement.toFixed(1)
  });
});
app.get("/predictMood", authMiddleware, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id }).sort({ createdAt: -1 });

  if (moods.length < 3) {
    return res.json({ prediction: "Not enough data" });
  }

  const last3 = moods.slice(0, 3).map(m => m.mood);

  const freq = {};
  last3.forEach(m => freq[m] = (freq[m] || 0) + 1);

  const prediction = Object.keys(freq).reduce((a, b) =>
    freq[a] > freq[b] ? a : b
  );

  res.json({ prediction });
});
app.get("/correlation", authMiddleware, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id });

  let highEnergyHappy = 0;
  let lowEnergySad = 0;

  moods.forEach(m => {
    if (m.energy === "high" && m.mood === "happy") highEnergyHappy++;
    if (m.energy === "low" && m.mood === "sad") lowEnergySad++;
  });

  res.json({
    message: `High energy leads to happiness ${highEnergyHappy} times. Low energy leads to sadness ${lowEnergySad} times.`
  });
});
app.get("/recommend", authMiddleware, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id });

  const negative = moods.filter(m =>
    ["sad", "anxious"].includes(m.mood)
  ).length;

  if (negative > moods.length / 2) {
    return res.json({
      tip: "Try exercise, sunlight, or social interaction"
    });
  }

  res.json({ tip: "Keep doing what works for you" });
});
/* ================= AUTH ================= */

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashed });
  await user.save();

  res.json({ message: "Registered" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

/* ================= MOODS ================= */

app.post("/addMood", authMiddleware, async (req, res) => {
  const { mood, energy, intensity, note } = req.body;

  if (!mood || !energy || !intensity)
    return res.status(400).json({ message: "Missing fields" });

  await Mood.create({
    userId: req.user.id,
    mood,
    energy,
    intensity,
    note,
  });

  res.json({ message: "Mood saved" });
});

app.get("/getMoods", authMiddleware, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(moods);
});

/* ================= JOURNAL ================= */

app.post("/addJournal", authMiddleware, async (req, res) => {
  const { text } = req.body;

  const lower = text.toLowerCase();

  // 🔥 REAL keyword-based sentiment
  let sentiment = "neutral";

  if (lower.match(/sad|tired|depressed|alone/)) sentiment = "negative";
  else if (lower.match(/happy|excited|great|love/)) sentiment = "positive";
  else if (lower.match(/angry|frustrated/)) sentiment = "angry";
  else if (lower.match(/anxious|worried|stress/)) sentiment = "anxious";

  await Journal.create({
    userId: req.user.id,
    text,
    sentiment,
  });

  res.json({ message: "Journal saved", sentiment });
});

app.get("/getJournals", authMiddleware, async (req, res) => {
  const data = await Journal.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(data);
});

/* ================= SMART INSIGHTS ================= */

app.get("/insights", authMiddleware, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id });

  if (moods.length === 0)
    return res.json({ message: "No data yet" });

  const negativeCount = moods.filter(m =>
    ["sad", "angry", "anxious"].includes(m.mood)
  ).length;

  const avgIntensity =
    moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length;

  let suggestion = "";

  if (negativeCount > moods.length / 2 && avgIntensity >= 4) {
    suggestion = "⚠️ High stress detected. Take a break, talk to someone.";
  } else if (negativeCount > moods.length / 2) {
    suggestion = "You seem low. Try rest, journaling, or light activity.";
  } else {
    suggestion = "Mood stable. Keep your routine consistent.";
  }

  res.json({ suggestion });
});

/* ================= STREAK SYSTEM ================= */

app.get("/streak", authMiddleware, async (req, res) => {
  const moods = await Mood.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  let streak = 0;
  let prevDate = null;

  for (let m of moods) {
    const date = new Date(m.createdAt).toDateString();

    if (!prevDate) {
      streak++;
      prevDate = date;
      continue;
    }

    const diff =
      (new Date(prevDate) - new Date(date)) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
      prevDate = date;
    } else break;
  }

  res.json({ streak });
});

/* ================= RISK DETECTION ================= */

app.get("/risk", authMiddleware, async (req, res) => {
  const journals = await Journal.find({ userId: req.user.id });

  const risky = journals.some(j =>
    j.text.toLowerCase().match(/hopeless|worthless|suicide|die/)
  );

  if (risky) {
    return res.json({
      risk: true,
      message: "⚠️ You may need support. Consider talking to someone.",
    });
  }

  res.json({ risk: false });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));