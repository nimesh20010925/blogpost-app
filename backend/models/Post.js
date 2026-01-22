const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String, // filename of uploaded image
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  author: String,
  category: String,
  excerpt: String,
  publishDate: Date,
  allowComments: Boolean,
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
