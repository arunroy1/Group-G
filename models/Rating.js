const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  value:     { type: Number, min: 1, max: 5, required: true },
  recipeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);

