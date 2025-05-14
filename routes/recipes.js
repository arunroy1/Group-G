// routes/recipes.js

const express             = require('express');
const aws                 = require('aws-sdk');
const multer              = require('multer');
const multerS3            = require('multer-s3');
const router              = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const recipesController   = require('../controllers/recipesController');

// Configure AWS SDK
aws.config.update({
  region: process.env.AWS_REGION
});
const s3 = new aws.S3();

// Configure multer to use S3 for storage
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    key(req, file, cb) {
      // e.g. recipes/1616161616_originalname.jpg
      const filename = `recipes/${Date.now()}_${file.originalname}`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // optional: limit to 5 MB
});

// 1) HTML page at GET /recipes
router.get('/', recipesController.showAllRecipesPage);

// 2) JSON API at GET /recipes/api
router.get('/api', recipesController.getAllRecipes);

// 3) Show Add Recipe form
router.get('/addrecipe', isAuthenticated, recipesController.showAddForm);

// 4) Handle Add Recipe POST (image uploaded to S3)
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