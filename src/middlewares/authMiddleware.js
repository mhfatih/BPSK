const jwt = require('jsonwebtoken');
const { users } = require('../db');

const SECRET_KEY = 'secret123';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = users.find(u => u.email === decoded.email);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User tidak ditemukan' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

module.exports = authMiddleware;
