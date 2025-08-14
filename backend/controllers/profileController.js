const User = require('../models/User');

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id || req.user.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');
    const posts = await require('../models/Post').find({ author: user._id });
    const events = await require('../models/Event').find({ organizer: user._id });
    res.json({ user, posts, events });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Edit profile (with avatar upload)
const multer = require('multer');
const storage = multer.diskStorage({ /* same as above */ });
const upload = multer({ storage });

exports.editProfile = [upload.single('avatar'), async (req, res) => {
  const { name, bio, location } = req.body;
  try {
    const updates = { name, bio, location };
    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}];

// Bookmark post/event
exports.bookmark = async (req, res) => {
  const { type, id } = req.body; // type: 'post' or 'event'
  try {
    const user = await User.findById(req.user.id);
    if (type === 'post' && !user.bookmarks.posts.includes(id)) {
      user.bookmarks.posts.push(id);
    } else if (type === 'event' && !user.bookmarks.events.includes(id)) {
      user.bookmarks.events.push(id);
    }
    await user.save();
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('bookmarks.posts')
      .populate('bookmarks.events');
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};