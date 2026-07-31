const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  role: {
    type: String,
    required: true
  },
  questions: [
    {
      question: String,
      answer: String,
      feedback: String,
      score: Number
    }
  ],
  overallScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Interview", interviewSchema);