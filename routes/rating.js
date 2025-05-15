const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const ratingController = require('../controllers/ratingController');

// GET all ratings
router.get('/', ratingController.getAllRatings);

// GET average rating for a specific recipe
router.get('/recipe/:recipeId', ratingController.getAverageRating);

// POST a new or updated rating
router.post('/', isAuthenticated, ratingController.createOrUpdateRating);

// DELETE a rating by ID
router.delete('/:id', isAuthenticated, ratingController.deleteRating);

module.exports = router;

