const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guest_id: {
    type: String,
    sparse: true
  },
  mode: {
    type: String,
    enum: ['this_or_that', 'yes_no', 'pick_from_list', 'wheel'],
    required: true
  },
  question: {
    type: String,
    required: true,
    maxlength: 500
  },
  options: [{
    type: String,
    required: true
  }],
  result: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  is_public: {
    type: Boolean,
    default: false
  },
  likes_count: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
decisionSchema.index({ user_id: 1, created_at: -1 });
decisionSchema.index({ is_public: 1, likes_count: -1 });

module.exports = mongoose.model('Decision', decisionSchema);
