const { users } = require('../db');
const { v4: uuidv4 } = require('uuid');

// READ all users
const getAllUsers = (req, res) => {
  res.json(users);
};

// READ single user by id
const getUserById = (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  res.json(user);
};

// CREATE user baru
const createUser = (req, res) => {
  const { email, namaLengkap, password, role } = req.body;

  if (!email || !namaLengkap || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah digunakan' });
  }

  const newUser = {
    id: uuidv4(),
    email,
    password,
    role: role || 'user',
    profile: {
      namaLengkap,
      tanggalLahir: null,
      jenisKelamin: null,
      kota: null,        
      alamat: null,
      kodePos: null,
      noHp: null,
      identitas: null,
    },
  };

  users.push(newUser);
  res.status(201).json({ message: 'User berhasil dibuat', user: newUser });
};

// UPDATE user by id
const updateUser = (req, res) => {
  const { id } = req.params;
  const { password, role, namaLengkap } = req.body;

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  if (password) user.password = password;
  if (role) user.role = role;
  if (namaLengkap) user.profile.namaLengkap = namaLengkap;

  res.json({ message: 'User berhasil diupdate', user });
};

// DELETE user by id
const deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'User tidak ditemukan' });

  users.splice(index, 1);
  res.json({ message: 'User berhasil dihapus' });
};

// GET PROFILE (hanya user itu sendiri)
const getProfile = (req, res) => {
  const userId = req.user.id; // id dari JWT
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user.profile
  });
};

// EDIT PROFILE (hanya user itu sendiri)
const updateProfile = (req, res) => {
  const userId = req.user.id; // id dari JWT
  const { namaLengkap, tanggalLahir, jenisKelamin, kota, alamat, kodePos, noHp, identitas } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  // Update field profile jika ada
  if (namaLengkap) user.profile.namaLengkap = namaLengkap;
  if (tanggalLahir) user.profile.tanggalLahir = tanggalLahir;
  if (jenisKelamin) user.profile.jenisKelamin = jenisKelamin;
  if (kota) user.profile.kota = kota;           
  if (alamat) user.profile.alamat = alamat;
  if (kodePos) user.profile.kodePos = kodePos;
  if (noHp) user.profile.noHp = noHp;
  if (identitas) user.profile.identitas = identitas;

  res.json({ message: 'Profil berhasil diperbarui', profile: user.profile });
};

// CHANGE PASSWORD (hanya user itu sendiri)
const changePassword = (req, res) => {
  const userId = req.user.id; // id dari JWT
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  // Cek apakah password lama benar
  if (user.password !== oldPassword) {
    return res.status(400).json({ message: 'Password lama salah' });
  }

  // Cek apakah password baru sama dengan konfirmasi
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Password baru dan konfirmasi tidak sama' });
  }

  // Update password
  user.password = newPassword;

  res.json({ message: 'Password berhasil diubah' });
};


module.exports = { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  getProfile, 
  updateProfile, 
  changePassword 
};

