const Decision = require('../models/Decision');
const Vote = require('../models/Vote');
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

async function getVoteFeed(req, res) {
  try {
    const { exclude } = req.query;
    const excludeIds = exclude ? exclude.split(',').filter(id => id.match(/^[0-9a-fA-F]{24}$/)) : [];

    const match = {
      is_public: true,
      mode: { $in: ['this_or_that', 'pick_from_list'] }
    };
    if (excludeIds.length) match._id = { $nin: excludeIds };

    const decisions = await Decision.aggregate([
      { $match: match },
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: 'votes',
          let: { decisionId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$decision_id', '$$decisionId'] } } },
            { $group: { _id: '$chosen_option', count: { $sum: 1 } } }
          ],
          as: 'vote_counts'
        }
      },
      {
        $addFields: {
          votes: {
            $arrayToObject: {
              $map: {
                input: '$vote_counts',
                as: 'vc',
                in: { k: '$$vc._id', v: '$$vc.count' }
              }
            }
          }
        }
      },
      { $project: { vote_counts: 0 } }
    ]);

    if (!decisions.length) {
      return res.json({ decision: null });
    }

    res.json({ decision: decisions[0] });
  } catch (error) {
    console.error('Vote feed error:', error);
    res.status(500).json({ error: 'Failed to fetch vote feed' });
  }
}

async function castVote(req, res) {
  try {
    const { id } = req.params;
    const { chosen_option, voter_id } = req.body;

    const decision = await Decision.findById(id);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    const vote = new Vote({
      decision_id: id,
      voter_id: voter_id || null,
      chosen_option
    });
    await vote.save();

    const voteCounts = await Vote.aggregate([
      { $match: { decision_id: decision._id } },
      { $group: { _id: '$chosen_option', count: { $sum: 1 } } }
    ]);

    const votes = {};
    voteCounts.forEach(v => { votes[v._id] = v.count; });
    const total = voteCounts.reduce((s, v) => s + v.count, 0);

    res.json({ votes, total, your_vote: chosen_option });
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
}

module.exports = {
  makeDecision,
  getHistory,
  deleteDecision,
  likeDecision,
  getPublicDecisions,
  getVoteFeed,
  castVote
};
