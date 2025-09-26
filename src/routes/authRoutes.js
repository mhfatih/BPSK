const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

// Register & Login
router.post('/register', register);
router.post('/login', login);

// Profile
router.get('/profile/:email', getProfile);
router.put('/profile/:email', updateProfile);

module.exports = router;
