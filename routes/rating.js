const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating'); // Adjust path as needed

// GET all ratings 
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

//GET average rating for a specific recipe
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const ratings = await Rating.find({ recipeId: req.params.recipeId });

    if (ratings.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const sum = ratings.reduce((total, r) => total + r.value, 0);
    const average = sum / ratings.length;

    res.json({ average: average.toFixed(2), count: ratings.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate average rating' });
  }
});

//POST a new rating
router.post('/', async (req, res) => {
  const { recipeId, userId, value } = req.body;

  if (!recipeId || !userId || value == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (value < 1 || value > 5) {
    return res.status(400).json({ error: 'Rating value must be between 1 and 5' });
  }

  try {
    //Check if user already rated the recipe
    const existing = await Rating.findOne({ recipeId, userId });
    if (existing) {
      existing.value = value;
      const updated = await existing.save();
      return res.json(updated);
    }

    const newRating = new Rating({ recipeId, userId, value });
    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

//DELETE a rating by ID (admin or if user wants to undo rating)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Rating.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Rating not found' });
    res.json({ message: 'Rating deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid rating ID' });
  }
});

module.exports = router;
