// routes/recipes.js

const express            = require('express');
const path               = require('path');
const multer             = require('multer');
const router             = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const recipesController  = require('../controllers/recipesController');

// configure multer → uploads land in public/uploads
const upload = multer({
  dest: path.join(__dirname, '../public/uploads')
});

// JSON API: GET all
router.get('/', recipesController.getAllRecipes);

// Show Add Recipe form
router.get('/addrecipe', isAuthenticated, recipesController.showAddForm);

// Handle Add Recipe POST (with optional image)
router.post(
  '/addrecipe',
  isAuthenticated,
  upload.single('image'),
  recipesController.createRecipe
);

// **NEW** Show one recipe (HTML view)
router.get('/:id', recipesController.showRecipe);

// (You can still add JSON endpoints if you like, but this covers the UI path.)

// PUT update (JSON)
router.put('/:id', isAuthenticated, recipesController.updateRecipe);

// DELETE (JSON)
router.delete('/:id', isAuthenticated, recipesController.deleteRecipe);

module.exports = router;