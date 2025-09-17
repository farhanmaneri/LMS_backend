const express = require('express');
const { createUser, getAllUsers } = require('../controllers/admin');
const { protect, adminOnly } = require('../middlewares/auth.js');

const adminRoutes = express.Router();

adminRoutes.post('/create-user', protect, adminOnly, createUser);
adminRoutes.get('/users', protect, adminOnly, getAllUsers); // New route

module.exports = adminRoutes;