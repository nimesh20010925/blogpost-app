const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    const post = await Post.create(req.body);
    res.json(post);
};

exports.getPosts = async (req, res) => {
    const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts);
};

exports.getAllPosts = async (req, res) => {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
};

exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.json(post);
};

exports.updatePost = async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
};

exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted' });
};
