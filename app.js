const session     = require('express-session');
const MongoStore  = require('connect-mongo');
const express     = require('express');
const path        = require('path');
const mongoose    = require('mongoose');
const dotenv      = require('dotenv');

dotenv.config();

const app   = express();
const PORT  = process.env.PORT || 3000;

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import middlewares
const localsMiddleware = require('./middleware/locals');
const { handleErrors } = require('./middleware/error-handler'); 

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'a really secret key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make req.session.user, isAuthenticated and path available in all views
app.use(localsMiddleware.setLocals);

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Home route now uses EJS
app.get('/', (req, res) => {
  res.render('index');
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB Atlas'))
.catch(err => console.error(' MongoDB connection error:', err));

// Route handlers
const recipeRoutes  = require('./routes/recipes');
const commentRoutes = require('./routes/comment');
const ratingRoutes  = require('./routes/rating');
const authRoutes    = require('./routes/auth');

app.use('/recipes', recipeRoutes);
app.use('/comments', commentRoutes);
app.use('/ratings', ratingRoutes);
app.use('/', authRoutes);

// Error handling middleware
app.use(handleErrors);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});