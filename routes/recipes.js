// routes/recipes.js

const express             = require('express');
const path                = require('path');
const multer              = require('multer');
const router              = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const recipesController   = require('../controllers/recipesController');

// configure multer → uploads land in public/uploads
const upload = multer({
  dest: path.join(__dirname, '../public/uploads')
});

// 1) HTML page at GET /recipes
router.get('/', recipesController.showAllRecipesPage);

// 2) JSON API at GET /recipes/api
router.get('/api', recipesController.getAllRecipes);

// 3) Show Add Recipe form
router.get('/addrecipe', isAuthenticated, recipesController.showAddForm);

// 4) Handle Add Recipe POST
router.post(
  '/addrecipe',
  isAuthenticated,
  upload.single('image'),
  recipesController.createRecipe
);

// 5) Show one recipe (HTML)
router.get('/:id', recipesController.showRecipe);

// 6) PUT update (JSON)
router.put('/:id', isAuthenticated, recipesController.updateRecipe);

// 7) DELETE (JSON)
router.delete('/:id', isAuthenticated, recipesController.deleteRecipe);

module.exports = router;