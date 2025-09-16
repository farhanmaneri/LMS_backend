const express = require('express');
const { createUser } = require('../controllers/admin');
const { protect, adminOnly } = require('../middlewares/auth.js');

const adminRoutes = express.Router();

adminRoutes.post('/create-user', protect, adminOnly, createUser);

module.exports = adminRoutes;