const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPost, getFeed, likePost } = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/feed', auth, getFeed);
router.put('/like/:id', auth, likePost);

// TODO: Add comment, save, share routes here later

module.exports = router;
