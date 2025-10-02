const jwt = require('jsonwebtoken');
const { users } = require('../db');
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = 'secret123';

// REGISTER
const register = (req, res) => {
  const { email, namaLengkap, password, confirmPassword } = req.body;

  if (!email || !namaLengkap || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password dan konfirmasi password tidak sama' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }

  users.push({
    id: uuidv4(),
    email,
    password,
    role: 'user', // default role
    profile: {
      namaLengkap,
      tanggalLahir: null,
      jenisKelamin: null,
      alamat: null,
      kota: null,
      kodePos: null,
      noHp: null,
      identitas: null,
    },
  });

  res.status(201).json({ message: 'Registrasi berhasil' });
};

// LOGIN
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }

  // Buat token JWT dengan role & id user (supaya bisa dipakai untuk getProfile/updateProfile)
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600000
  });

  res.json({
    message: `Login berhasil, selamat datang ${user.profile.namaLengkap}`,
    role: user.role
  });
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout berhasil' });
};

module.exports = { register, login, logout };
