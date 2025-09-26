const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
app.use('/auth', authRoutes);
app.use('/form', formRoutes);

// Route sederhana
app.get('/', (req, res) => {
  res.send('Server Connected');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
