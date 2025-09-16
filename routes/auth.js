const express = require('express');
const { protect } = require('../middlewares/auth.js');
const { login, changePassword, forgetPassword, resetPassword } = require('../controllers/auth');

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/change-password', protect, changePassword);
authRoutes.post('/forget-password', forgetPassword);
authRoutes.post('/reset-password', resetPassword);

module.exports = authRoutes;