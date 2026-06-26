const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss');

const authRoutes = require('./routes/authRoutes');
const decisionRoutes = require('./routes/decisionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing with XSS protection
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// XSS sanitization middleware
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', decisionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', subscriberRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// ads.txt for AdSense verification
app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.send('google.com, pub-6057388520703385, DIRECT, f08c47fec0942fa0');
});

// Serve built frontend in production
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

// SPA fallback — serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Error handler
app.use(errorHandler);

module.exports = app;
