const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

exports.createPost = async (req, res) => {
    try {
        const { title, content, author, category, tags, excerpt, publishDate, allowComments } = req.body;

        const postData = {
            title,
            content,
            author,
            category,
            tags,
            excerpt,
            publishDate,
            allowComments,
            status: 'draft'
        };

        // If file was uploaded, save the filename
        if (req.file) {
            postData.image = req.file.filename;
        }

        const post = await Post.create(postData);
        res.json(post);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
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
    try {
        const { title, content, author, category, excerpt, publishDate, allowComments, status } = req.body;

        const updateData = {
            title,
            content,
            author,
            category,
            excerpt,
            publishDate,
            allowComments,
            status
        };

        // If new file was uploaded, delete old image and save new filename
        if (req.file) {
            const post = await Post.findById(req.params.id);
            if (post && post.image) {
                const oldImagePath = path.join(__dirname, '../uploads', post.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.image = req.file.filename;
        }

        const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(post);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        // Delete associated image file
        if (post && post.image) {
            const imagePath = path.join(__dirname, '../uploads', post.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ msg: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


// Publish post
exports.publishPost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                status: 'published',
                publishDate: new Date()
            },
            { new: true }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Move post to draft
exports.draftPost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                status: 'draft'
            },
            { new: true }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
