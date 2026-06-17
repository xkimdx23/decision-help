const Decision = require('../models/Decision');
const { makeDecisionWithBias, generateReason } = require('../utils/positiveBias');

async function makeDecision(req, res) {
  try {
    const { mode, question, options, is_public, language } = req.body;
    const positiveScore = req.positiveScore || 0;
    
    // Validate inputs
    if (!mode || !question) {
      return res.status(400).json({ error: 'Mode and question are required' });
    }
    
    let validOptions = [];
    if (mode === 'yes_no') {
      validOptions = ['Yes', 'No'];
    } else if (mode === 'this_or_that') {
      if (!options || options.length < 2) {
        return res.status(400).json({ error: 'Need at least 2 options for This or That mode' });
      }
      validOptions = options.slice(0, 2);
    } else if (mode === 'pick_from_list') {
      if (!options || options.length < 2) {
        return res.status(400).json({ error: 'Need at least 2 options for list mode' });
      }
      validOptions = options.slice(0, 10);
    }
    
    // Make decision with positive bias
    const result = makeDecisionWithBias(validOptions, positiveScore);
    const reason = generateReason(result, mode);
    
    // Save to database if available
    let savedDecision = null;
    try {
      if (req.user) {
        const decision = new Decision({
          user_id: req.user._id,
          mode,
          question,
          options: validOptions,
          result,
          reason,
          is_public: is_public || false,
          language: language || 'en'
        });
        savedDecision = await decision.save();
        if (req.user.total_decisions !== undefined) {
          req.user.total_decisions += 1;
          await req.user.save().catch(function(){});
        }
      } else if (req.body.guest_id) {
        const decision = new Decision({
          guest_id: req.body.guest_id,
          mode,
          question,
          options: validOptions,
          result,
          reason,
          is_public: false,
          language: language || 'en'
        });
        savedDecision = await decision.save();
      }
    } catch (dbError) {
      // DB unavailable — decision still works, just not persisted
      console.warn('Could not persist decision (DB may be unavailable)');
    }
    
    res.json({
      success: true,
      decision: {
        result,
        reason,
        mode,
        question,
        options: validOptions,
        id: savedDecision?._id || null
      }
    });
    
  } catch (error) {
    console.error('Decision error:', error);
    res.status(500).json({ error: 'Failed to make decision' });
  }
}

async function getHistory(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = { user_id: req.user._id };
    const decisions = await Decision.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Decision.countDocuments(query);
    
    res.json({
      decisions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}

async function deleteDecision(req, res) {
  try {
    const { id } = req.params;
    const decision = await Decision.findOne({ _id: id, user_id: req.user._id });
    
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    
    await decision.deleteOne();
    res.json({ message: 'Decision deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete decision' });
  }
}

async function likeDecision(req, res) {
  try {
    const { id } = req.params;
    const decision = await Decision.findById(id);
    
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }
    
    decision.likes_count += 1;
    await decision.save();
    
    res.json({ likes: decision.likes_count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like decision' });
  }
}

async function getPublicDecisions(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const language = req.query.language || 'en';
    const skip = (page - 1) * limit;
    
    const decisions = await Decision.find({ is_public: true, language })
      .sort({ likes_count: -1, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'username');
    
    const total = await Decision.countDocuments({ is_public: true, language });
    
    res.json({
      decisions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public decisions' });
  }
}

module.exports = {
  makeDecision,
  getHistory,
  deleteDecision,
  likeDecision,
  getPublicDecisions
};
