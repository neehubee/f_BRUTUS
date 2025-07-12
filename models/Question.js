const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  doneDate: Date,
  status: {
    "0": { type:Boolean, defaul:  false },
    "1": { type: Boolean, default: false },
    "4": { type: Boolean, default: false },
    "9": { type: Boolean, default: false },
    "14": { type: Boolean, default: false },
    "21": { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
