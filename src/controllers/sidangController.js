const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { sendEmail } = require('../utils/mailer');

/**
 * Get semua sidang (admin/superadmin)
 */
const getAllSidang = async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Akses ditolak' });

    const [rowsUser] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rowsUser[0];

    let query = `
      SELECT s.*, k.wilayah, k.status, k.created_by 
      FROM kasus_sidang s
      JOIN kasus k ON s.kasus_id = k.id
    `;
    const params = [];

    if (req.user.role === 'admin') {
      query += ' WHERE k.wilayah = ?';
      params.push(user.wilayah);
    }

    query += ' ORDER BY s.created_at DESC';

    const [sidangList] = await db.query(query, params);
    res.json(sidangList);
  } catch (err) {
    console.error('Error getAllSidang:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Get semua sidang berdasarkan kasus_id
 */
const getSidangByKasusId = async (req, res) => {
  const { id } = req.params; // id kasus
  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    const [rowsUser] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rowsUser[0];

    if (req.user.role === 'admin' && kasus.wilayah !== user.wilayah)
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke wilayah kasus ini' });

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
 * Get detail sidang berdasarkan id
 */
const getSidangById = async (req, res) => {
  const { id } = req.params; // id sidang

  try {
    const [rowsSidang] = await db.query(
      `SELECT s.*, k.wilayah, k.status 
       FROM kasus_sidang s 
       JOIN kasus k ON s.kasus_id = k.id
       WHERE s.id = ?`,
      [id]
    );

    if (rowsSidang.length === 0)
      return res.status(404).json({ message: 'Sidang tidak ditemukan' });

    const sidang = rowsSidang[0];

    const [rowsUser] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rowsUser[0];

    if (req.user.role === 'admin' && sidang.wilayah !== user.wilayah)
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke wilayah sidang ini' });

    res.json(sidang);
  } catch (err) {
    console.error('Error getSidangById:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Create sidang baru
 */
const createSidang = async (req, res) => {
  const { id } = req.params; // id kasus

  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    const [rowsUser] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rowsUser[0];

    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Hanya admin/superadmin yang bisa membuat sidang' });

    if (req.user.role === 'admin' && kasus.wilayah !== user.wilayah)
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke wilayah kasus ini' });

    if (kasus.status !== 'Diproses')
      return res.status(400).json({ message: 'Kasus belum Diproses, tidak bisa membuat sidang' });

    const [existingSidang] = await db.query(
      'SELECT COUNT(*) AS count FROM kasus_sidang WHERE kasus_id = ?',
      [id]
    );
    const sidangKe = existingSidang[0].count + 1;

    const sidangId = uuidv4();

    // ✅ Kosongan (tanpa tanggal, jam, metode, hasil)
    await db.query(
      `INSERT INTO kasus_sidang 
      (id, kasus_id, sidang_ke, created_at)
      VALUES (?, ?, ?, NOW())`,
      [sidangId, id, sidangKe]
    );

    res.status(201).json({
      message: `Sidang ke-${sidangKe} berhasil dibuat (kosongan)`,
      id: sidangId,
      kasus_id: id,
      sidang_ke: sidangKe,
    });
  } catch (err) {
    console.error('Error createSidang:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update jadwal sidang
 */
const updateJadwalSidang = async (req, res) => {
  const { id } = req.params; // id sidang
  const { tanggalSidang, jamSidang } = req.body;

  try {
    // 🔹 Cek data sidang
    const [sidangRows] = await db.query('SELECT * FROM kasus_sidang WHERE id = ?', [id]);
    if (sidangRows.length === 0)
      return res.status(404).json({ message: 'Data sidang tidak ditemukan' });

    const kasusId = sidangRows[0].kasus_id;

    // 🔹 Ambil data kasus
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [kasusId]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Data kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // 🔹 Ambil data admin login
    const [rowsUser] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rowsUser[0];

    // 🔹 Validasi role
    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Hanya admin/superadmin yang bisa mengubah jadwal sidang' });

    if (req.user.role === 'admin' && kasus.wilayah !== user.wilayah)
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke wilayah kasus ini' });

    // 🔹 Update jadwal sidang
    await db.query(
      `UPDATE kasus_sidang 
       SET tanggal_sidang = ?, jam_sidang = ?
       WHERE id = ?`,
      [tanggalSidang, jamSidang, id]
    );

    // 🔹 Kirim email TANPA await (non-blocking)
    if (kasus.pengadu_email) {
      const subject = '📅 Jadwal Sidang Anda Telah Diperbarui';
      const html = `
        <p>Halo <b>${kasus.pengadu_nama}</b>,</p>
        <p>Jadwal sidang untuk pengaduan Anda telah diperbarui oleh pihak admin.</p>
        <p><b>Tanggal Sidang:</b> ${tanggalSidang}<br>
        <b>Jam Sidang:</b> ${jamSidang}</p>
        <p>Silakan hadir sesuai jadwal atau hubungi petugas BPSK untuk informasi lebih lanjut.</p>
        <br>
        <p>Hormat kami,<br>
        <b>Layanan Pengaduan Konsumen</b></p>
      `;

      // Kirim email di background
      sendEmail(kasus.pengadu_email, subject, html)
        .catch(err => console.error("Gagal kirim email (jadwal sidang):", err));
    }

    // 🔹 Response langsung tanpa menunggu email
    res.json({
      message: 'Jadwal sidang berhasil diperbarui',
      id,
      email_sent: kasus.pengadu_email ? true : false
    });

  } catch (err) {
    console.error('Error updateJadwalSidang:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update hasil sidang (metode & hasil)
 */
const updateHasilSidang = async (req, res) => {
  const { id } = req.params; // id sidang
  const { metodePenyelesaian, hasilSidang } = req.body;

  try {
    const [sidangRows] = await db.query('SELECT * FROM kasus_sidang WHERE id = ?', [id]);
    if (sidangRows.length === 0)
      return res.status(404).json({ message: 'Data sidang tidak ditemukan' });

    const kasusId = sidangRows[0].kasus_id;
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [kasusId]);
    const kasus = rowsKasus[0];

    const [rowsUser] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rowsUser[0];

    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Hanya admin/superadmin yang bisa mengubah hasil sidang' });

    if (req.user.role === 'admin' && kasus.wilayah !== user.wilayah)
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke wilayah kasus ini' });

    await db.query(
      `UPDATE kasus_sidang 
       SET metode_penyelesaian = ?, hasil_sidang = ?
       WHERE id = ?`,
      [metodePenyelesaian, hasilSidang, id]
    );

    res.json({ message: 'Hasil sidang berhasil diperbarui', id });
  } catch (err) {
    console.error('Error updateHasilSidang:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Hapus sidang berdasarkan id
 */
const deleteSidang = async (req, res) => {
  const { id } = req.params; // id sidang

  try {
    const [rowsSidang] = await db.query(
      `SELECT s.*, k.wilayah 
       FROM kasus_sidang s
       JOIN kasus k ON s.kasus_id = k.id
       WHERE s.id = ?`,
      [id]
    );

    if (rowsSidang.length === 0)
      return res.status(404).json({ message: 'Sidang tidak ditemukan' });

    const sidang = rowsSidang[0];

    const [rowsUser] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rowsUser[0];

    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Akses ditolak' });

    if (req.user.role === 'admin' && sidang.wilayah !== user.wilayah)
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke wilayah sidang ini' });

    await db.query('DELETE FROM kasus_sidang WHERE id = ?', [id]);
    res.json({ message: 'Sidang berhasil dihapus' });
  } catch (err) {
    console.error('Error deleteSidang:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  createSidang,
  getAllSidang,
  getSidangByKasusId,
  getSidangById,
  updateJadwalSidang,
  updateHasilSidang,
  deleteSidang,
};
