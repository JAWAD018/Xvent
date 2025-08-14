const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Follow/Unfollow (example, expand as needed)
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow.followers.includes(currentUser._id)) {
      await userToFollow.updateOne({ $push: { followers: currentUser._id } });
      await currentUser.updateOne({ $push: { following: userToFollow._id } });

      // Send notification
      const io = req.app.get('io');
      const notification = new require('../models/Notification')({
        user: userToFollow._id,
        type: 'follow',
        fromUser: currentUser._id,
        message: `${currentUser.name} followed you`,
      });
      await notification.save();
      io.to(userToFollow._id.toString()).emit('newNotification', notification);
    } else {
      // Unfollow logic similarly
    }
    res.json({ msg: 'Followed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};