const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestSchema = new Schema({
  author:        { type: Schema.Types.ObjectId, ref: 'TrivUser' },
  category:      { type: String },
  question:      { type: String, required: true, unique: true },
  right_answer:  { type: String },
  wrong_answers: [{ type: String }], 
  veto :         [{ type: Schema.Types.ObjectId }],
  isMultiple:    { type: Boolean },
  isTrue:        { type: Boolean },
}, { timestamps: true });



const Quest = mongoose.model('Quest', QuestSchema);

module.exports = Quest;

