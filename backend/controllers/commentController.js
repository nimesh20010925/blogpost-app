const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const comment = await Comment.create({
    postId: req.params.postId,
    ...req.body
  });
  res.json(comment);
};

exports.getComments = async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId });
  res.json(comments);
};
