const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., '6:00 PM IST'
  venue: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // e.g., 'Music', 'Tech'
  type: { type: String, enum: ['In-Person', 'Online', 'Hybrid'], required: true },
  tags: [{ type: String }],
  registrationLink: { type: String },
  banner: { type: String }, // URL to uploaded banner
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);