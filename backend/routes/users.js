const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { login, followUser } = require('../controllers/userController');

// Registration handled by /api/auth/register
router.post('/login', login);
router.put('/follow/:id', auth, followUser);

// TODO: Add unfollow route here later

module.exports = router;
