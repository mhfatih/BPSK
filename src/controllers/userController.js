const db = require('../db');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// READ all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, u.email, u.role, 
        p.nama_lengkap, p.tanggal_lahir, p.jenis_kelamin,
        p.kota, p.alamat, p.kode_pos, p.no_hp,
        p.identitas, p.foto_identitas
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// READ single user by id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, u.email, u.role,
        p.nama_lengkap, p.tanggal_lahir, p.jenis_kelamin,
        p.kota, p.alamat, p.kode_pos, p.no_hp,
        p.identitas, p.foto_identitas
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// CREATE user baru
const createUser = async (req, res) => {
  const { email, password, role, nama_lengkap } = req.body;

  if (!email || !password || !nama_lengkap) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    const userId = uuidv4();

    // Insert ke tabel users
    await db.query(`
      INSERT INTO users (id, email, password, role)
      VALUES (?, ?, ?, ?)
    `, [userId, email, password, role || 'user']);

    // Insert ke tabel profiles
    await db.query(`
      INSERT INTO profiles (user_id, nama_lengkap)
      VALUES (?, ?)
    `, [userId, nama_lengkap]);

    res.status(201).json({ message: 'User berhasil dibuat', user_id: userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// UPDATE user by id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, role, nama_lengkap } = req.body;

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    await db.query(`
      UPDATE users
      SET password = COALESCE(?, password),
          role = COALESCE(?, role)
      WHERE id = ?
    `, [password, role, id]);

    await db.query(`
      UPDATE profiles
      SET nama_lengkap = COALESCE(?, nama_lengkap)
      WHERE user_id = ?
    `, [nama_lengkap, id]);

    res.json({ message: 'User berhasil diupdate' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// DELETE user by id
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    await db.query('DELETE FROM users WHERE id = ?', [id]); // akan otomatis hapus profile karena ON DELETE CASCADE
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// GET PROFILE (user login sendiri)
const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, u.email, u.role,
        p.nama_lengkap, p.tanggal_lahir, p.jenis_kelamin,
        p.kota, p.alamat, p.kode_pos, p.no_hp,
        p.identitas, p.foto_identitas
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [userId]);

    if (rows.length === 0) return res.status(404).json({ message: 'Profil tidak ditemukan' });

    const user = rows[0];
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: {
        nama_lengkap: user.nama_lengkap,
        tanggal_lahir: user.tanggal_lahir,
        jenis_kelamin: user.jenis_kelamin,
        kota: user.kota,
        alamat: user.alamat,
        kode_pos: user.kode_pos,
        no_hp: user.no_hp,
        identitas: user.identitas,
        foto_identitas: user.foto_identitas
          ? `${req.protocol}://${req.get('host')}${user.foto_identitas}`
          : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// UPDATE PROFILE (user login sendiri)
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    nama_lengkap, tanggal_lahir, jenis_kelamin, kota,
    alamat, kode_pos, no_hp, identitas
  } = req.body;

  const foto_identitas = req.file
    ? `/uploads/${userId}/profile/${req.file.filename}`
    : null;

  try {
    await db.query(`
      UPDATE profiles
      SET 
        nama_lengkap = COALESCE(?, nama_lengkap),
        tanggal_lahir = COALESCE(?, tanggal_lahir),
        jenis_kelamin = COALESCE(?, jenis_kelamin),
        kota = COALESCE(?, kota),
        alamat = COALESCE(?, alamat),
        kode_pos = COALESCE(?, kode_pos),
        no_hp = COALESCE(?, no_hp),
        identitas = COALESCE(?, identitas),
        foto_identitas = COALESCE(?, foto_identitas)
      WHERE user_id = ?
    `, [
      nama_lengkap, tanggal_lahir, jenis_kelamin, kota, alamat,
      kode_pos, no_hp, identitas, foto_identitas, userId
    ]);

    const [rows] = await db.query(`
      SELECT * FROM profiles WHERE user_id = ?
    `, [userId]);

    res.json({ message: 'Profil berhasil diperbarui', profile: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// CHANGE PASSWORD (user login sendiri)
const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { old_password, new_password, confirm_password } = req.body;

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    const user = rows[0];
    if (user.password !== old_password)
      return res.status(400).json({ message: 'Password lama salah' });
    if (new_password !== confirm_password)
      return res.status(400).json({ message: 'Password baru dan konfirmasi tidak sama' });

    await db.query('UPDATE users SET password = ? WHERE id = ?', [new_password, userId]);
    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
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
