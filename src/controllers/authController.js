const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const SECRET_KEY = 'secret123';

// REGISTER
const register = async (req, res) => {
  const { email, nama, password, confirm_password } = req.body;

  if (!email || !nama || !password || !confirm_password)
    return res.status(400).json({ message: 'Semua field wajib diisi' });

  if (password !== confirm_password)
    return res.status(400).json({ message: 'Password dan konfirmasi tidak sama' });

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: 'Email sudah terdaftar' });

    const userId = uuidv4();

    await db.query(`
      INSERT INTO users (id, email, password, role)
      VALUES (?, ?, ?, 'user')
    `, [userId, email, password]);

    await db.query(`
      INSERT INTO profiles (user_id, nama)
      VALUES (?, ?)
    `, [userId, nama]);

    res.status(201).json({ message: 'Registrasi berhasil', user_id: userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email dan password wajib diisi' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0 || rows[0].password !== password)
      return res.status(401).json({ message: 'Email atau password salah' });

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, wilayah: user.wilayah },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });
    res.json({
      message: `Login berhasil, selamat datang!`,
      token,
      id: user.id,
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout berhasil' });
};

module.exports = { register, login, logout };
