const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  name: String,
  email: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
