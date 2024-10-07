const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');    
const mongoose = require('mongoose');
const flash = require('connect-flash');
const Media = require('./models/media');
const Note = require('./models/note');  
const config = require('./config.json');

const app = express();

// MongoDB connection
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Set up view engine and static file serving
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Session management for admin authentication and flash messages
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// Make flash messages available in templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'video/mp4', 'video/avi', 'video/mpeg', 'video/quicktime', 'video/x-matroska',
            'application/pdf'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
});

// Admin authentication middleware
function isAdmin(req, res, next) {
    if (req.session.admin) {
        return next();
    }
    res.redirect('/login');
}

// Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === config.USERNAME && password === config.PASSWORD) {
        req.session.admin = true;
        req.flash('success_msg', 'Logged in successfully');
        res.redirect('/upload');
    } else {
        req.flash('error_msg', 'Invalid credentials');
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    req.flash('success_msg', 'Logged out successfully');
    res.redirect('/login');
});

app.get('/', async (req, res) => {
    try {
        const media = await Media.find();
        res.render('gallery', { media });
    } catch (error) {
        console.error('Error fetching media:', error);
        req.flash('error_msg', 'Error fetching gallery');
        res.redirect('/');
    }
});

app.get('/upload', isAdmin, (req, res) => {
    res.render('upload');
});

app.post('/upload', isAdmin, upload.array('media', 10), async (req, res) => {
    try {
        const { title } = req.body;
        const files = req.files.map(file => ({
            url: file.filename,
            type: file.mimetype,
            title: title || 'Untitled',
            date: new Date(),
            isLivePhoto: file.mimetype === 'video/mp4'
        }));

        await Media.insertMany(files);
        req.flash('success_msg', 'Media uploaded successfully');
        res.redirect('/');
    } catch (error) {
        console.error('Error uploading files:', error);
        req.flash('error_msg', 'Error uploading media');
        res.redirect('/upload');
    }
});

app.post('/delete/:id', isAdmin, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            req.flash('error_msg', 'Media not found');
            return res.redirect('/');
        }

        const filePath = path.join(__dirname, 'uploads', media.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Media.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Media deleted successfully');
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting media:', error);
        req.flash('error_msg', 'Server error during deletion');
        res.redirect('/');
    }
});

// Notes feature
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ date: -1 });
        res.render('keepnote', { notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        req.flash('error_msg', 'Error fetching notes');
        res.redirect('/');
    }
});

app.post('/notes', upload.single('noteImage'), async (req, res) => {
    console.log(req.body); // Check the fields coming through
    console.log(req.file); // Check the file object

    try {
        const { title, content, date } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        const newNote = new Note({
            title,
            content,
            date,
            imageUrl
        });

        await newNote.save();
        req.flash('success_msg', 'Note created successfully');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error creating note:', error);
        req.flash('error_msg', 'Error creating note');
        res.redirect('/notes');
    }
});

// Route for note upload page
app.get('/noteupload', (req, res) => {
    res.render('noteupload');
});

// Consolidated route to delete a note by ID
app.post('/notes/delete/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Note deleted successfully');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error deleting note:', error);
        req.flash('error_msg', 'Error deleting note');
        res.redirect('/notes');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
