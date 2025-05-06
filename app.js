const session     = require('express-session');
const MongoStore  = require('connect-mongo');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// Import middlewares
const localsMiddleware = require('./middleware/locals');
const { handleErrors } = require('./middleware/error-handler'); 

// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'a really secret key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Locals middleware
app.use(localsMiddleware.setLocals);

app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB Atlas'))
.catch(err => console.error(' MongoDB connection error:', err));

// Route handlers
const recipeRoutes = require('./routes/recipes');
const commentRoutes = require('./routes/comment');
const ratingRoutes = require('./routes/rating');
const authRoutes = require('./routes/auth');

app.use('/recipes', recipeRoutes);
app.use('/comments', commentRoutes);
app.use('/ratings', ratingRoutes);
app.use('/', authRoutes);

app.use(handleErrors);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



