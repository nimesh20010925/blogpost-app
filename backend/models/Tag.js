const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: String
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);
