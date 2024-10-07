const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now // Automatically set the date to now
    }
});

// Media Schema
const mediaSchema = new mongoose.Schema({
    url: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String, 
        required: true, 
        default: 'Untitled' // Default title if none is provided
    },
    date: { 
        type: Date, 
        required: true, 
        default: Date.now // Default to the current date if none is provided
    },
    isLivePhoto: { 
        type: Boolean, 
        default: false // Flag to indicate if the media is a live photo
    },
    likes: { 
        type: Number, 
        default: 0 // Default like count is 0
    },
    comments: [commentSchema] // Array of comments
});

// Export the Media model
module.exports = mongoose.model('Media', mediaSchema);
