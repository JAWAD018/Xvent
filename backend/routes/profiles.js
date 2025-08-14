const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, editProfile, bookmark, getBookmarks } = require('../controllers/profileController');

// Own profile
router.get('/', auth, getProfile);

// Other user's profile
router.get('/:id', auth, getProfile);

router.put('/', auth, editProfile);
router.post('/bookmark', auth, bookmark);
router.get('/bookmarks', auth, getBookmarks);

module.exports = router;
