const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

// Multer for banner
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create event
exports.createEvent = [upload.single('banner'), async (req, res) => {
  const { title, description, date, time, venue, category, type, tags, registrationLink } = req.body;
  try {
    // Validate date > current (Aug 14, 2025)
    if (new Date(date) <= new Date('2025-08-14')) {
      return res.status(400).json({ msg: 'Event date must be in the future' });
    }

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      time,
      venue,
      organizer: req.user.id,
      category,
      type,
      tags: tags ? tags.split(',') : [],
      registrationLink,
      banner: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}];

// Get event details
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Register for event
exports.registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event.registrations.includes(req.user.id)) {
      await event.updateOne({ $push: { registrations: req.user.id } });

      // Notification to organizer
      const io = req.app.get('io');
      const notification = new require('../models/Notification')({
        user: event.organizer,
        type: 'registration',
        fromUser: req.user.id,
        event: event._id,
        message: 'Someone registered for your event',
      });
      await notification.save();
      io.to(event.organizer.toString()).emit('newNotification', notification);
    }
    res.json(event.registrations);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Search events (by category, location, etc.)

// exports.searchEvents = async (req, res) => {
//   const { category, location = 'Hyderabad', page = 1, limit = 10 } = req.query;
//   try {
//     const query = {};
//     if (category) query.category = category;
//     if (location) query.venue = { $regex: location, $options: 'i' };

//     const events = await Event.find(query)
//       .sort({ date: 1 }) // Upcoming first
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


exports.searchEvents = async (req, res) => {
  const { category, location = 'Hyderabad', page = 1, limit = 10 } = req.query;
  try {
    const query = {};
    if (category) query.category = category;
    if (location) query.venue = { $regex: location, $options: 'i' };

    console.log('Search Query:', query); // Log the query
    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(events);
  } catch (err) {
    console.error('Search Error:', err); // Log the error
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Add more: top events by registrations, etc.