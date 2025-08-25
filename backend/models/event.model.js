const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., '6:00 PM IST'
  venue: { type: String, required: true },
  
  // Organizer is a custom name given by the user
  organizer: { type: String, required: true },

  // The actual logged-in user who posts this event
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  category: { type: String, required: true },
  type: { type: String, enum: ['In-Person', 'Online', 'Hybrid'], required: true },
  tags: [{ type: String }],
  registrationLink: { type: String },
  image: { type: String, required: true },

  // Engagement like posts
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
