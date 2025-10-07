const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });

    req.user = user; // simpan payload token ke req.user
    next();
  });
};

module.exports = authenticateToken;
