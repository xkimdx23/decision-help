const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  blocked_input: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ip_address: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    default: 'Blocked by safety filter'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
