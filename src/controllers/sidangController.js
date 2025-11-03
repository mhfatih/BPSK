const { v4: uuidv4 } = require('uuid');
const db = require('../db');

/**
 * Create sidang baru (hanya jika status kasus = 'Diterima')
 */
const createSidang = async (req, res) => {
  const { id } = req.params; // id kasus
  const { tanggalSidang, jamMulai, jamSelesai, hasilSidang } = req.body;

  try {
    // 🔍 Cek kasus
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // 🚫 Validasi role dan status
    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Hanya admin/superadmin yang bisa membuat sidang' });

    if (kasus.status !== 'Diterima')
      return res.status(400).json({ message: 'Kasus belum diterima, tidak bisa membuat sidang' });

    // 🔢 Hitung sidang ke-
    const [existingSidang] = await db.query('SELECT COUNT(*) AS count FROM kasus_sidang WHERE kasus_id = ?', [id]);
    const sidangKe = existingSidang[0].count + 1;

    // 🚫 Maksimum 3 sidang
    if (sidangKe > 3)
      return res.status(400).json({ message: 'Sidang sudah mencapai batas maksimal (3 kali)' });

    const sidangId = uuidv4();

    // 💾 Simpan sidang baru
    await db.query(`
      INSERT INTO kasus_sidang (id, kasus_id, sidang_ke, tanggal_sidang, jam_mulai, jam_selesai, hasil_sidang)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [sidangId, id, sidangKe, tanggalSidang, jamMulai, jamSelesai, hasilSidang || null]);

    res.status(201).json({
      message: `Sidang ke-${sidangKe} berhasil dibuat`,
      sidang_id: sidangId,
      kasus_id: id,
      sidang_ke: sidangKe
    });
  } catch (err) {
    console.error('Error createSidang:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Get semua sidang berdasarkan kasus_id
 */
const getSidangByKasusId = async (req, res) => {
  const { id } = req.params; // id kasus
  try {
    const [sidangList] = await db.query(
      'SELECT * FROM kasus_sidang WHERE kasus_id = ? ORDER BY sidang_ke ASC',
      [id]
    );

    res.json(sidangList);
  } catch (err) {
    console.error('Error getSidangByKasusId:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update data sidang berdasarkan id sidang
 */
const updateSidangById = async (req, res) => {
  const { sidangId } = req.params;
  const { tanggalSidang, jamMulai, jamSelesai, hasilSidang } = req.body;

  try {
    // 🔍 Cek data sidang
    const [sidangRows] = await db.query('SELECT * FROM kasus_sidang WHERE id = ?', [sidangId]);
    if (sidangRows.length === 0)
      return res.status(404).json({ message: 'Data sidang tidak ditemukan' });

    // 🔍 Ambil kasus untuk validasi status
    const kasusId = sidangRows[0].kasus_id;
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [kasusId]);
    const kasus = rowsKasus[0];

    // 🚫 Validasi role dan status
    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Hanya admin/superadmin yang bisa update sidang' });

    if (kasus.status !== 'Diterima')
      return res.status(400).json({ message: 'Kasus belum diterima, tidak bisa update sidang' });

    // 💾 Update data sidang
    await db.query(
      'UPDATE kasus_sidang SET tanggal_sidang = ?, jam_mulai = ?, jam_selesai = ?, hasil_sidang = ? WHERE id = ?',
      [tanggalSidang, jamMulai, jamSelesai, hasilSidang, sidangId]
    );

    res.json({
      message: 'Data sidang berhasil diperbarui',
      sidang_id: sidangId,
    });
  } catch (err) {
    console.error('Error updateSidangById:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  createSidang,
  getSidangByKasusId,
  updateSidangById
};
