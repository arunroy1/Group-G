const path = require('path');
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// Serve signup form
router.get('/signup', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

// Handle signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id;
    return res.redirect('/');
  } catch (err) {
    return res.status(400).send('Signup error: ' + err.message);
  }
});

// Serve login form
router.get('/login', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).send('Invalid credentials');
  }
  req.session.userId = user._id;
  res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout error');
    res.redirect('/login');
  });
});

module.exports = router;
