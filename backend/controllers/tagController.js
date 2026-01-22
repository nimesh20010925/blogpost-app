const Tag = require('../models/Tag');

exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        const tag = await Tag.create({ name, slug });
        res.json(tag);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.getTags = async (req, res) => {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
};

exports.deleteTag = async (req, res) => {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Tag deleted' });
};