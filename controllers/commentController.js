// controllers/commentController.js

const Comment = require('../models/Comment');

// GET all comments (global)
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment
      .find()
      .populate('user', 'username')
      .populate('recipe', 'title')    // optional: include recipe title
      .sort('-createdAt')
      .lean();
    res.json(comments);
  } catch (err) {
    console.error('getAllComments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// GET comments for a specific recipe
exports.getCommentsByRecipe = async (req, res) => {
  try {
    const comments = await Comment
      .find({ recipe: req.params.recipeId })
      .populate('user', 'username')
      .sort('-createdAt')
      .lean();
    res.json(comments);
  } catch (err) {
    console.error('getCommentsByRecipe error:', err);
    res.status(500).json({ error: 'Failed to fetch comments for this recipe' });
  }
};

// POST create a new comment
exports.createComment = async (req, res) => {
  const { recipeId, text } = req.body;
  const userId = req.session.user.id;

  if (!recipeId || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newComment = new Comment({
      recipe: recipeId,
      user:   userId,
      text
    });
    const saved = await newComment.save();
    await saved.populate('user', 'username');
    res.status(201).json(saved);
  } catch (err) {
    console.error('createComment error:', err);
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
    console.error('deleteComment error:', err);
    res.status(400).json({ error: 'Invalid comment ID' });
  }
};