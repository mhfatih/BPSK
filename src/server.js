const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://10.255.100.180:5173', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Import main routes
const routes = require('./routes/routes');
app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
