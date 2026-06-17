const Report = require('../models/Report');

const BLACKLIST = [
  'kill', 'murder', 'attack', 'weapon', 'gun', 'knife', 'bomb', 'explosion',
  'abuse', 'torture', 'blood', 'injury', 'hurt', 'pain', 'die', 'death',
  'suicide', 'self-harm', 'cut', 'kill myself', 'end my life',
  'sex', 'porn', 'naked', 'nude', 'erotic', 'sexual', 'penis', 'vagina',
  'orgasm', 'escort', 'prostitute', 'strip', 'xxx', 'adult',
  'drug', 'cocaine', 'heroin', 'weed', 'marijuana', 'alcohol', 'drunk',
  'cigarette', 'meth', 'opium', 'lsd', 'ecstasy',
  'hate', 'racist', 'nazi', 'terrorist', 'stupid', 'idiot', 'moron',
  'steal', 'rob', 'burglary', 'hack', 'fraud', 'scam', 'cheat', 'illegal',
  'toxic', 'harass', 'bully', 'threat', 'violent',
  'gambling', 'casino', 'bet', 'lottery',
  'satanic', 'curse', 'demon', 'hell',
  'puke', 'vomit', 'poop', 'shit', 'fuck', 'ass', 'bitch', 'damn'
];

const POSITIVE_KEYWORDS = [
  'learn', 'study', 'practice', 'improve', 'grow', 'help', 'support',
  'friend', 'family', 'love', 'care', 'kind', 'creative', 'art', 'music',
  'sports', 'exercise', 'health', 'healthy', 'meditate', 'yoga', 'read',
  'write', 'draw', 'paint', 'cook', 'bake', 'travel', 'explore', 'nature',
  'volunteer', 'donate', 'share', 'teach', 'mentor', 'inspire', 'dream',
  'career', 'job', 'business', 'skill', 'hobby', 'fitness', 'run', 'walk',
  'dance', 'sing', 'play', 'code', 'build', 'create', 'design', 'start'
];

function containsBlacklistedContent(text) {
  const lowerText = text.toLowerCase();
  return BLACKLIST.some(word => {
    if (word.includes(' ')) return lowerText.includes(word);
    const regex = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    return regex.test(lowerText);
  });
}

function getPositiveScore(text) {
  const lowerText = text.toLowerCase();
  let score = 0;
  for (const word of POSITIVE_KEYWORDS) {
    const regex = new RegExp('\\b' + word + '\\b', 'i');
    if (regex.test(lowerText)) score += 10;
  }
  return score;
}

async function safetyFilter(req, res, next) {
  const { question, options } = req.body;

  if (containsBlacklistedContent(question)) {
    logBlockedAttempt(req, question).catch(function(){});
    return res.status(400).json({
      error: 'Please keep things positive! Ask about hobbies, learning, travel, career, relationships, or fun activities.'
    });
  }

  if (options && Array.isArray(options)) {
    for (const option of options) {
      if (containsBlacklistedContent(option)) {
        logBlockedAttempt(req, option).catch(function(){});
        return res.status(400).json({
          error: 'Keep it positive! Choose options that are kind, creative, or helpful.'
        });
      }
    }
  }

  req.positiveScore = getPositiveScore(question) + (options ? options.reduce((sum, opt) => sum + getPositiveScore(opt), 0) : 0);
  next();
}

async function logBlockedAttempt(req, blockedInput) {
  try {
    const report = new Report({
      blocked_input: blockedInput,
      user_id: req.user?.id || null,
      ip_address: req.ip || req.connection.remoteAddress,
      reason: 'Blocked by safety filter'
    });
    await report.save();
  } catch (error) {
    console.error('Failed to log blocked attempt:', error);
  }
}

module.exports = { safetyFilter, containsBlacklistedContent, getPositiveScore };
