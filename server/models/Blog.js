const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This Field is required'
    },
    description: {
        type: String,
        required: 'This Field is required'
    },
    username: {
        type: String,
        required: 'This Field is required'
    },
    ratings: {
        type: Number,
        required: 'This Field is required',
        min: 0,
        max: 10
    },
    categories: {
        type: String,
        enum: ["SHOUJO", "SHOUNEN", "JOSEI", "SEINEN", "ACTION", "CHARACTER"],
        required: 'This Field is required',
    },
    image: {
        type: String,
        required: 'This Field is required',
    }
});

//blogSchema.index({ name: 'text', description: 'text', categories: 'text', username: 'text' });
blogSchema.index({ "$**": 'text' });

module.exports = mongoose.model('Blog', blogSchema);