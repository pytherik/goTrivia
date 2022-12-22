const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrivUserSchema = new Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  cat:      { type: Array, default: ['Alles'] },
  score: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model('TrivUser', TrivUserSchema);

module.exports = User;