const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VetoSchema = new Schema({
  author:        { type: Schema.Types.ObjectId },
  quest_author:  { type: Schema.Types.ObjectId },
  quest_id:      { type: Schema.Types.ObjectId },
  question:      { type: String },
  new_answer:    { type: String },
  old_answer:    { type: String },
  comment:       { type: String },
}, { timestamps: true });



const Veto = mongoose.model('Veto', VetoSchema);

module.exports = Veto;

