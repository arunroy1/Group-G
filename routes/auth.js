// routes/auth.js

const express = require('express');
const router = express.Router();
const { isNotAuthenticated } = require('../middleware/auth');
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

module.exports = router;

