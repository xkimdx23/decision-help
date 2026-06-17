const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  language_code: {
    type: String,
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'ja', 'ko', 'zh', 'ar']
  },
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

translationSchema.index({ language_code: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Translation', translationSchema);
