// controllers/recipesController.js

const Comment = require('../models/Comment');
const Rating  = require('../models/Rating');
const Recipe  = require('../models/Recipe');

/**
 * Renders the “All Recipes” HTML page
 */
exports.showAllRecipesPage = async (req, res, next) => {
  try {
    // pull everything (lean for performance)
    const recipes = await Recipe.find().lean();
    res.render('recipes', { recipes });
  } catch (err) {
    next(err);
  }
};

/**
 * showAddForm — renders the Add Recipe form
 */
exports.showAddForm = (req, res) => {
  res.render('addrecipe', {
    error: null,
    form: { title:'', description:'', ingredients:'', instructions:'', tags:'' }
  });
};

/**
 * showRecipe — renders the “View Details” page
 */
exports.showRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) return res.status(404).send('Recipe not found');

    // pull comments
    const comments = await Comment.find({ recipe: req.params.id })
                                  .populate('user','username')
                                  .sort('-createdAt')
                                  .lean();

    // pull ratings
    const ratings = await Rating.find({ recipe: req.params.id }).lean();
    const count   = ratings.length;
    const sum     = ratings.reduce((tot,r) => tot + r.value, 0);
    const average = count ? (sum/count).toFixed(2) : 0;

    // see if current user has rated
    let userRating = null;
    if (req.session.user) {
      const mine = ratings.find(r => String(r.user) === String(req.session.user.id));
      userRating = mine?.value || null;
    }

    res.render('recipe', {
      recipe,
      comments,
      average,
      count,
      userRating
    });
  } catch (err) {
    console.error('showRecipe error:', err);
    res.status(400).send('Invalid recipe ID');
  }
};

/**
 * GET all recipes (JSON)
 */
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

/**
 * createRecipe — handles form POST (with optional image upload)
 */
exports.createRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, tags } = req.body;
  if (!title || !description || !ingredients || !instructions) {
    return res.render('addrecipe', {
      error: 'Please fill in all required fields.',
      form: { title, description, ingredients, instructions, tags }
    });
  }

  try {
    const newRecipe = new Recipe({
      title,
      description,
      ingredients: ingredients.split(',').map(s => s.trim()),
      instructions,
      tags: tags ? tags.split(',').map(s => s.trim()) : [],
      user: req.session.user.id,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    });

    await newRecipe.save();
    return res.redirect('/');
  } catch (err) {
    console.error('createRecipe error:', err);
    return res.render('addrecipe', {
      error: err.message,
      form: { title, description, ingredients, instructions, tags }
    });
  }
};

/**
 * PUT update recipe (JSON)
 */
exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Recipe not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Invalid update or ID' });
  }
};

/**
 * DELETE recipe (JSON)
 */
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid recipe ID' });
  }
};