// models/Recipe.js

const mongoose = require('mongoose');


const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    
  }
});


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
