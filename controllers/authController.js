// controllers/authController.js

const path = require('path');
const User = require('../models/User');

// GET signup form
exports.getSignup = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
};

// POST handle signup
exports.postSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    req.session.user = {
      id: user._id,
      username: user.username
    };

    return res.redirect('/');
  } catch (err) {
    return res.status(400).send('Signup error: ' + err.message);
  }
};

// GET login form
exports.getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
};

// POST handle login
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).send('Invalid credentials');
  }
  req.session.user = {
    id: user._id,
    username: user.username
  };

  res.redirect('/');
};

// GET logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout error');
    res.redirect('/login');
  });
};
