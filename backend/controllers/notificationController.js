const Notification = require('../models/Notification');

// Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('fromUser', 'name avatar');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Mark as read
exports.markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ msg: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};