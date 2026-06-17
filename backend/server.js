require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/decisiondb';

// Connect to MongoDB (optional — server works without it for decision making)
let mongoConnected = false;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3000,
})
.then(() => {
  mongoConnected = true;
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.warn('⚠️ MongoDB not available — running with limited functionality');
  console.warn('   Decision making still works, but auth/history/community will not persist.');
});

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 30,
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
