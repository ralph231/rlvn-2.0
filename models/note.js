// models/note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,  // Optional image URL
        default: null
    },
    date: {
        type: Date,
        required: true
    }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;