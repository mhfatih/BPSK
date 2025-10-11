const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const SECRET_KEY = 'secret123';

// REGISTER
const register = async (req, res) => {
  const { email, nama_lengkap, password, confirm_password } = req.body;

  if (!email || !nama_lengkap || !password || !confirm_password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Password dan konfirmasi password tidak sama' });
  }

  try {
    // cek email udah ada atau belum
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const user_id = uuidv4();
    const profile_id = uuidv4();

    // insert ke tabel users
    await db.query(
      'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
      [user_id, email, password, 'user']
    );

    // insert ke tabel profiles
    await db.query(
      'INSERT INTO profiles (id, user_id, nama_lengkap) VALUES (?, ?, ?)',
      [profile_id, user_id, nama_lengkap]
    );

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.password, u.role, p.nama_lengkap 
       FROM users u 
       JOIN profiles p ON u.id = p.user_id 
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    res.json({
      message: `Login berhasil, selamat datang ${user.nama_lengkap}`,
      token,
      id: user.id,
      nama_lengkap: user.nama_lengkap,
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
