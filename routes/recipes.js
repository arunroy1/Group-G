const express = require('express');
const router = express.Router();
// const Recipe = require('../../models/Recipe'); // Commented out for now

let recipes = []; // In-memory array to store recipes

// GET all recipes
router.get('/', (req, res) => {
  res.json(recipes);
});

// GET single recipe
router.get('/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

// POST create recipe
router.post('/', (req, res) => {
  const { title, description, ingredients, instructions, tags } = req.body;
  if (!title || !description || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simulating a recipe object without the model
  const newRecipe = {
    id: Date.now().toString(), // Using current timestamp as unique ID
    title,
    description,
    ingredients,
    instructions,
    tags,
    likes: 0 // Start with 0 likes
  };

  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// PUT update recipe
router.put('/:id', (req, res) => {
  const index = recipes.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Recipe not found' });

  const updated = {
    ...recipes[index],
    ...req.body,
    id: recipes[index].id // prevent changing ID
  };

  recipes[index] = updated;
  res.json(updated);
});

// DELETE recipe
router.delete('/:id', (req, res) => {
  recipes = recipes.filter(r => r.id !== req.params.id);
  res.json({ message: 'Recipe deleted' });
});

// POST like recipe
router.post('/:id/like', (req, res) => {
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  recipe.likes++;
  res.json({ likes: recipe.likes });
});

module.exports = router;

