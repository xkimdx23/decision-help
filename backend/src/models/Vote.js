const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  decision_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Decision',
    required: true
  },
  voter_id: {
    type: String,
    default: null
  },
  chosen_option: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

voteSchema.index({ decision_id: 1, voter_id: 1 });

module.exports = mongoose.model('Vote', voteSchema);
