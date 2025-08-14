const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { signup, login, followUser } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.put('/follow/:id', auth, followUser);

// TODO: Add unfollow route here later

module.exports = router;
