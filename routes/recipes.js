// routes/recipes.js

const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const { isAuthenticated } = require('../middleware/auth');

// GET all recipes
router.get('/', recipesController.getAllRecipes);

// GET single recipe
router.get('/:id', recipesController.getRecipeById);

// POST create recipe
router.post('/', isAuthenticated, recipesController.createRecipe);

// PUT update recipe
router.put('/:id', isAuthenticated, recipesController.updateRecipe);

// DELETE recipe
router.delete('/:id', isAuthenticated, recipesController.deleteRecipe);

module.exports = router;


