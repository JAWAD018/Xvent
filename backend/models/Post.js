const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String }, // URL to uploaded image
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    date: { type: Date, default: Date.now }
  }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Bookmarks
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);