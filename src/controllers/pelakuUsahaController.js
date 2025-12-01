const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * GET semua pelaku usaha berdasarkan kasus
 */
const getPelakuUsahaByKasus = async (req, res) => {
  const { id } = req.params; // id = kasus_id
  try {
    // cek kasus
    const [kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (kasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    // validasi akses
    if (req.user.role === 'user' && kasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat data orang lain' });

    // ambil semua pelaku
    const [rows] = await db.query(
      'SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?',
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error getPelakuUsahaByKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * GET pelaku usaha berdasarkan ID pelaku
 */
const getPelakuUsahaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE id = ?', [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Pelaku usaha tidak ditemukan' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Error getPelakuUsahaById:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * CREATE pelaku usaha (kosongan)
 */
const createPelakuUsaha = async (req, res) => {
  const { id } = req.params; // id = kasus_id
  try {
    // cek kasus
    const [kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (kasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    if (kasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh menambahkan pada kasus orang lain' });

    const newId = uuidv4();
    const dataKosong = {
      id: newId,
      kasus_id: id,
      pemilik: '',
      perusahaan: '',
      kota: '',
      alamat: '',
      kode_pos: '',
      no_hp: '',
      email: ''
    };

    await db.query('INSERT INTO kasus_pelaku_usaha SET ?', [dataKosong]);

    res.status(201).json({ message: 'Pelaku usaha baru berhasil dibuat', id: newId });
  } catch (err) {
    console.error('Error createPelakuUsaha:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * UPDATE pelaku usaha
 */
const updatePelakuUsahaById = async (req, res) => {
  const { id } = req.params;
  const { pemilik, perusahaan, kota, alamat, kode_pos, no_hp, email } = req.body;

  try {
    const [pelaku] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE id = ?', [id]);
    if (pelaku.length === 0)
      return res.status(404).json({ message: 'Pelaku usaha tidak ditemukan' });

    const [kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [pelaku[0].kasus_id]);
    if (kasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    if (kasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });

    await db.query('UPDATE kasus_pelaku_usaha SET ? WHERE id = ?', [
      { pemilik, perusahaan, kota, alamat, kode_pos, no_hp, email },
      id
    ]);

    res.json({ message: 'Data pelaku usaha berhasil diperbarui', id });
  } catch (err) {
    console.error('Error updatePelakuUsahaById:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * DELETE pelaku usaha berdasarkan ID pelaku
 */
const deletePelakuUsahaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [pelaku] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE id = ?', [id]);
    if (pelaku.length === 0)
      return res.status(404).json({ message: 'Pelaku usaha tidak ditemukan' });

    const [kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [pelaku[0].kasus_id]);
    if (kasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    if (kasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh menghapus kasus orang lain' });

    await db.query('DELETE FROM kasus_pelaku_usaha WHERE id = ?', [id]);

    res.json({ message: 'Pelaku usaha berhasil dihapus', id });
  } catch (err) {
    console.error('Error deletePelakuUsahaById:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  getPelakuUsahaByKasus,
  getPelakuUsahaById,
  createPelakuUsaha,
  updatePelakuUsahaById,
  deletePelakuUsahaById
};
