const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const secret = 'your_jwt_secret'; // Secure this in environment variables in production
const salt = bcrypt.genSaltSync(10); // Define the salt for bcrypt

// Middleware setup
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://muhammadabubakarjamiu:hccSjarodDl5C2B4@cluster0.hkjjejk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Authentication middleware
function authenticateUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json('Unauthorized: No token provided');
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json('Unauthorized: Invalid token');
    }
    req.user = user;
    next();
  });
}

// Registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (e) {
    console.error('Error during registration:', e);
    res.status(400).json({ message: 'Registration failed', error: e });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    return res.status(400).json({ message: 'Wrong credentials' });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        console.error('JWT sign error:', err);
        return res.status(500).json('Internal server error');
      }
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Use true in production with HTTPS
        sameSite: 'Strict',
      }).json({ id: userDoc._id, username });
    });
  } else {
    res.status(400).json({ message: 'Wrong credentials' });
  }
});

// Profile route
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json('Unauthorized: No token provided');
  }

  jwt.verify(token, secret, (err, info) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json('Unauthorized: Invalid token');
    }
    res.json(info);
  });
});

// Logout route
app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, sameSite: 'Strict' }).json('ok');
});

// Create post route
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

// Update post route
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

// Get all posts route
app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

// Get single post by ID route
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

// Get posts by the logged-in user
app.get('/user-posts', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ author: userId });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
