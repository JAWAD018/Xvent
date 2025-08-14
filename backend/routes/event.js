const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createEvent, getEvent, registerEvent, searchEvents } = require('../controllers/eventController');

router.post('/', auth, createEvent);
router.get('/:id', getEvent);
router.put('/register/:id', auth, registerEvent);
router.get('/search', searchEvents); // Public search

module.exports = router;