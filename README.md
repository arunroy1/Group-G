# Group-G
# 🍽️ Recipe Share

A full-stack web application where users can share, browse, comment on, and rate recipes. Built using **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JavaScript**.

---

## 📌 Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Usage](#usage)  
- [Routes Overview](#routes-overview)  
- [Middleware](#middleware)  
- [Contributors](#contributors)

---

## ✨ Features

- User authentication (signup, login, logout)
- View all recipes (HTML and JSON)
- Add, update, and delete recipes
- Comment on recipes
- Rate recipes (and update your rating)
- Responsive front-end built with custom CSS
- Error handling and session-based auth
- Protected routes for logged-in users

---

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript, EJS (template engine)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Other:** Multer (for image uploads), express-session, connect-mongo, dotenv

---

## 📌 Routes Overview

### 🍲 Recipes
- `GET /recipes` – Show all recipes (HTML)
- `GET /recipes/api` – All recipes in JSON
- `GET /recipes/addrecipe` – Form to add a recipe (auth required)
- `POST /recipes/addrecipe` – Submit new recipe with image (auth)
- `GET /recipes/:id` – View a single recipe (HTML)
- `PUT /recipes/:id` – Update a recipe (auth, JSON)
- `DELETE /recipes/:id` – Delete a recipe (auth, JSON)

### 💬 Comments
- `GET /comment` – Get all comments
- `GET /comment/recipe/:recipeId` – Get comments for one recipe
- `POST /comment` – Add a comment (auth required)
- `DELETE /comment/:id` – Delete a comment (auth)

### ⭐ Ratings
- `GET /rating` – All ratings
- `GET /rating/recipe/:recipeId` – Average rating for a recipe
- `POST /rating` – Add or update rating (auth)
- `DELETE /rating/:id` – Delete a rating (auth)

### 🔐 Auth
- `GET /auth/signup` – Show signup form
- `POST /auth/signup` – Register user
- `GET /auth/login` – Show login form
- `POST /auth/login` – Authenticate
- `GET /auth/logout` – Log out
- `GET /auth/profile` – Show user profile (auth only)
- `POST /auth/profile/password` – Change password (auth only)

---

## 🧰 Middleware

- `isAuthenticated`: Ensures a user is logged in before accessing certain routes.
- `isNotAuthenticated`: Blocks logged-in users from seeing login/signup pages.
- `setLocals`: Adds helpful variables to every view (e.g., user info, current path).
- `handleErrors`: Catches and handles common errors like 404s and CSRF errors.

---

## 👥 Contributors

- Jeanluca Valencia  
- Arun Roy  
- Zhien Lou  
- Dominique Boykin
