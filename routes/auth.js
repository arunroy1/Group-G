const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');               // ← Add this
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const authController = require('../controllers/authController');

// GET signup form
router.get('/signup', isNotAuthenticated, authController.getSignup);

// Live check for username availability
router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.json({ available: false });
  }
  try {
    const exists = await User.exists({ username });
    res.json({ available: !exists });
  } catch (err) {
    console.error('Username check error:', err);
    res.status(500).json({ available: false });
  }
});

// POST signup
router.post('/signup', authController.postSignup);

// GET login form
router.get('/login', isNotAuthenticated, authController.getLogin);

// POST login
router.post('/login', authController.postLogin);

// GET logout
router.get('/logout', authController.logout);

// GET profile page (protected)
router.get('/profile', isAuthenticated, authController.getProfile);

module.exports = router;