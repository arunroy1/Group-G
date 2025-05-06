// controllers/commentController.js

const Comment = require('../models/Comment');

// GET all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// GET comments for a specific recipe
exports.getCommentsByRecipe = async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.recipeId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments for this recipe' });
  }
};

// POST create a new comment
exports.createComment = async (req, res) => {
  const { recipeId, user, text } = req.body;

  if (!recipeId || !user || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newComment = new Comment({ recipeId, user, text });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
};

// DELETE a comment
exports.deleteComment = async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid comment ID' });
  }
};
