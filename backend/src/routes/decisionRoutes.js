const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { safetyFilter } = require('../middleware/safetyFilter');
const decisionController = require('../controllers/decisionController');

// Public route for making decisions (with guest support)
router.post('/decide', safetyFilter, decisionController.makeDecision);

// Public decisions browsing
router.get('/decisions/public', decisionController.getPublicDecisions);

// Vote feed
router.get('/decisions/vote-feed', decisionController.getVoteFeed);
router.post('/decisions/:id/vote', decisionController.castVote);

// Protected routes
router.get('/decisions/history', authMiddleware, decisionController.getHistory);
router.delete('/decisions/:id', authMiddleware, decisionController.deleteDecision);
router.post('/decisions/:id/like', authMiddleware, decisionController.likeDecision);

module.exports = router;
