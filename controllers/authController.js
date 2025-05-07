// controllers/authController.js

const path = require('path');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// GET profile page
exports.getProfile = async (req, res) => {
  try {

    const dbUser = await User.findById(req.session.user.id).lean();

    const recipes = await Recipe.find({ user: dbUser._id })
                                .sort('-createdAt')
                                .lean();

    res.render('profile', { user: dbUser, recipes });
  } catch (err) {
    console.error('Profile load error:', err);
    res.status(500).send('Error loading profile');
  }
};

// GET signup form
exports.getSignup = (req, res) => {
  // render with no error
  res.render('signup', { error: null });
};

// POST handle signup
exports.postSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    req.session.signedUp = true;
    return res.redirect('/');
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate username or email
      return res.status(400).render('signup', {
        error: 'You already have an account. Log In to continue.'
      });
    }
    return res.status(400).render('signup', {
      error: 'Signup error: ' + err.message
    });
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
    res.redirect('/');   // make sure this is '/' not '/login'
  });
};