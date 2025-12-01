const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// READ all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, u.email, u.role, 
        p.nama, p.tanggal_lahir, p.jenis_kelamin,
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
        p.nama, p.tanggal_lahir, p.jenis_kelamin,
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
  const { email, password, role, nama } = req.body;

  if (!email || !password || !nama) {
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
      INSERT INTO profiles (user_id, nama)
      VALUES (?, ?)
    `, [userId, nama]);

    res.status(201).json({ message: 'User berhasil dibuat', user_id: userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// UPDATE user by id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, role, nama } = req.body;

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
      SET nama = COALESCE(?, nama)
      WHERE user_id = ?
    `, [nama, id]);

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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
