const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create post (with image)
exports.createPost = [upload.single('image'), async (req, res) => {
  try {
    const newPost = new Post({
      author: req.user.id,
      text: req.body.text,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}];

// Get feed (posts from following + public, paginated)
exports.getFeed = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  try {
    const user = await require('../models/User').findById(req.user.id);
    const posts = await Post.find({
      $or: [{ author: { $in: user.following } }, { author: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Like post (similar for comment, save)
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });

      // Notification
      const io = req.app.get('io');
      const notification = new require('../models/Notification')({
        user: post.author,
        type: 'like',
        fromUser: req.user.id,
        post: post._id,
        message: 'Someone liked your post',
      });
      await notification.save();
      io.to(post.author.toString()).emit('newNotification', notification);
    }
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add more: comment, save, etc.