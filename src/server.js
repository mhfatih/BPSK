const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Import main routes
const routes = require('./routes/routes');
app.use('/api', routes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
