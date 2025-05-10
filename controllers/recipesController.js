
const Recipe = require('../models/Recipe');

// GET all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// GET single recipe
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: 'Invalid recipe ID' });
  }
};

// POST create recipe
exports.createRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, tags } = req.body;
  if (!title || !description || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      tags
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save recipe' });
  }
};

// PUT update recipe
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

// DELETE recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid recipe ID' });
  }
};
