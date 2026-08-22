require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes import
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Access variables from .env
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Error:', err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));