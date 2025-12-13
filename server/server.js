// This is the actual backend server code.
// To run this:
// 1. Install dependencies: npm install express mongoose cors dotenv
// 2. Run: node server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thinklab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
// In a real deployment, import routes from ./routes/auth.js, etc.
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Simple placeholder logic
    // const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered successfully', user: { name, email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Simple placeholder logic
    // const user = await User.findOne({ email });
    // if (!user || !await bcrypt.compare(password, user.password)) ...
    res.status(200).json({ message: 'Login successful', token: 'sample-jwt-token', user: { email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});