const User   = require('../models/User');
const Recipe = require('../models/Recipe');
const bcrypt = require('bcrypt');

exports.getSignup = (req, res) => {
  res.render('signup', {
    error: null,
    form: { username: '', email: '' }
  });
};

exports.postSignup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.render('signup', {
      error: 'Please fill in all fields.',
      form: { username, email }
    });
  }

  try {
    if (await User.exists({ username })) {
      return res.render('signup', {
        error: 'Username already taken.',
        form: { username, email }
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    // include email in session
    req.session.user = {
      id:       user._id,
      username: user.username,
      email:    user.email
    };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('signup', {
      error: 'Something went wrong. Please try again.',
      form: { username, email }
    });
  }
};

exports.getLogin = (req, res) => {
  res.render('login', {
    error: null,
    username: ''
  });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('login', {
      error: 'Both fields are required.',
      username
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', {
        error: 'Invalid credentials.',
        username
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.render('login', {
        error: 'Invalid credentials.',
        username
      });
    }

    req.session.user = {
      id:       user._id,
      username: user.username,
      email:    user.email
    };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', {
      error: 'Something went wrong.',
      username
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.getProfile = async (req, res, next) => {
  try {
    const fullUser = await User.findById(req.session.user.id).lean();
    if (!fullUser) return res.redirect('/login');

    const recipes = await Recipe.find({ user: fullUser._id }).lean();

    res.render('profile', {
      user:    fullUser,   // has username & email
      recipes              // array of their recipes
    });
  } catch (err) {
    next(err);
  }
};

exports.postPasswordUpdate = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.redirect('/profile');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.session.user.id, { password: hash });
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
};