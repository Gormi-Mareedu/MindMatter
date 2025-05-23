const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Protected route
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome back, Queen 👑`, userId: req.user.id });
});

module.exports = router;
