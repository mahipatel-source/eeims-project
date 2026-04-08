const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// protected route
router.get('/me', authenticate, authController.me);

module.exports = router;