const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  ingredients:  { type: [String], required: true },
  instructions: { type: String, required: true },
  tags:         { type: [String], default: [] },
  imageUrl:     { type: String, default: '/images/placeholder.jpg' },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
