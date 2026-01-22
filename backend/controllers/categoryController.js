const Category = require('../models/Category');

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        const category = await Category.create({ name, slug });
        res.json(category);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
};

// Delete category
exports.deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Category deleted' });
};
