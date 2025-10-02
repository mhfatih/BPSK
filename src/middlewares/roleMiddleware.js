// Middleware untuk ngecek role
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

const roleCheck = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

      const decoded = jwt.verify(token, SECRET_KEY);

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Akses ditolak, role tidak sesuai' });
      }

      req.user = decoded; // simpan user login ke request
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
  };
};

module.exports = roleCheck;
