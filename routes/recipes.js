// routes/recipes.js
require('dotenv').config();          // load .env first

const express             = require('express');
const S3                  = require('aws-sdk/clients/s3');  // v2-only S3 client
const multer              = require('multer');
const multerS3            = require('multer-s3');
const router              = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const recipesController   = require('../controllers/recipesController');

// Instantiate v2 S3 client
const s3 = new S3({
  region:          process.env.AWS_REGION,
  accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Sanity check: must print your bucket name (or 'undefined')
console.log('> S3_BUCKET is:', process.env.S3_BUCKET);

// Configure multer → multer-s3 storage on S3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,   // <-- must be set in .env or Render
    //acl: 'public-read',
    key(req, file, cb) {
      const filename = `recipes/${Date.now()}_${file.originalname}`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

// 1) HTML page at GET /recipes
router.get('/', recipesController.showAllRecipesPage);

// 2) JSON API at GET /recipes/api
router.get('/api', recipesController.getAllRecipes);

// 3) Show Add Recipe form
router.get('/addrecipe', isAuthenticated, recipesController.showAddForm);

// 4) Handle Add Recipe POST (upload to S3)
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
