const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User belum terautentikasi' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak, role tidak sesuai' });
    }

    next();
  };
};

module.exports = roleCheck;
