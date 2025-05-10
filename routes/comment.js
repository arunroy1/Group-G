// routes/comment.js

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');  // Import the controller
const { isAuthenticated } = require('../middleware/auth');

// GET all comments
router.get('/', commentController.getAllComments);

// GET comments for a specific recipe
router.get('/recipe/:recipeId', commentController.getCommentsByRecipe);

// POST create a new comment
router.post('/', isAuthenticated, commentController.createComment);

// DELETE a comment
router.delete('/:id', isAuthenticated, commentController.deleteComment);

module.exports = router;

