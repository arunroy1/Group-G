const session     = require('express-session');
const MongoStore  = require('connect-mongo');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(session({
  secret: process.env.SESSION_SECRET || 'a really secret key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Recipe routes
const recipeRoutes = require('./routes/recipes'); 
app.use('/api/recipes', recipeRoutes);


// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' Connected to MongoDB Atlas'))
.catch(err => console.error(' MongoDB connection error:', err))


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use(authRoutes);
