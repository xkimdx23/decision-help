const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Report = require('../models/Report');
const Translation = require('../models/Translation');

// Simple admin check (in production, add proper admin role)
const isAdmin = async (req, res, next) => {
  // For demo, check if email is admin email
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

router.get('/reports', authMiddleware, isAdmin, async (req, res) => {
  try {
    const reports = await Report.find().sort({ timestamp: -1 }).limit(100);
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

router.post('/translations', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { language_code, key, value } = req.body;
    
    const translation = await Translation.findOneAndUpdate(
      { language_code, key },
      { value },
      { upsert: true, new: true }
    );
    
    res.json({ translation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save translation' });
  }
});

module.exports = router;
