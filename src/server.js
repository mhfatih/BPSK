const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
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
