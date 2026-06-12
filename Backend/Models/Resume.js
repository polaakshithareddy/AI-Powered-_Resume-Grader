const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetJobRole: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  parsedText: { type: String },
  atsScore: { type: Number, default: 0 },
  aiSuggestions: [{ type: String }],
  missingKeywords: [{ type: String }],
  rewrittenBullets: [{
    original: { type: String },
    rewritten: { type: String },
    explanation: { type: String }
  }],
  improvedResumeUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
