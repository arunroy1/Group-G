// controllers/ratingController.js

const Rating = require('../models/Rating');

// GET all ratings (JSON)
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().lean();
    res.json(ratings);
  } catch (err) {
    console.error('getAllRatings error:', err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

// GET average rating for a specific recipe
exports.getAverageRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ recipe: req.params.recipeId }).lean();
    const count   = ratings.length;
    const sum     = ratings.reduce((tot, r) => tot + r.value, 0);
    const average = count ? (sum/count).toFixed(2) : 0;
    res.json({ average, count });
  } catch (err) {
    console.error('getAverageRating error:', err);
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
};

// POST a new or updated rating
exports.createOrUpdateRating = async (req, res) => {
  const { recipeId, value } = req.body;
  const userId = req.session.user.id;

  if (!recipeId || value == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (value < 1 || value > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    let existing = await Rating.findOne({ recipe: recipeId, user: userId });
    if (existing) {
      existing.value = value;
      await existing.save();
      return res.json(existing);
    }
    const newRating = new Rating({ recipe: recipeId, user: userId, value });
    const saved     = await newRating.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('createOrUpdateRating error:', err);
    res.status(500).json({ error: 'Failed to save rating' });
  }
};

// DELETE a rating by ID
exports.deleteRating = async (req, res) => {
  try {
    const deleted = await Rating.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Rating not found' });
    res.json({ message: 'Rating deleted' });
  } catch (err) {
    console.error('deleteRating error:', err);
    res.status(400).json({ error: 'Invalid rating ID' });
  }
};