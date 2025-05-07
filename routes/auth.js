const express = require('express');
const router = express.Router();
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const authController = require('../controllers/authController');

// GET signup form
router.get('/signup', isNotAuthenticated, authController.getSignup);

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