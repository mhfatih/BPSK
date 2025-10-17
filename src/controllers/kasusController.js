const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../db');

/**
 * Get semua kasus (lengkap dengan relasi)
 */
const getAllKasus = async (req, res) => {
  try {
    let query = '';
    let params = [];

    // Hak akses berdasarkan role
    if (req.user.role === 'superadmin') {
      query = `
        SELECT 
          k.*, 
          d.nama_lengkap AS nama_pengadu, 
          p.perusahaan AS nama_perusahaan
        FROM kasus k
        LEFT JOIN kasus_data_diri d ON k.id = d.kasus_id
        LEFT JOIN kasus_pelaku_usaha p ON k.id = p.kasus_id
        ORDER BY k.created_at DESC
      `;
    } else if (req.user.role === 'admin') {
      query = `
        SELECT 
          k.*, 
          d.nama_lengkap AS nama_pengadu, 
          p.perusahaan AS nama_perusahaan
        FROM kasus k
        LEFT JOIN kasus_data_diri d ON k.id = d.kasus_id
        LEFT JOIN kasus_pelaku_usaha p ON k.id = p.kasus_id
        WHERE NOT (k.status = 'Draf' AND k.created_by != ?)
        ORDER BY k.created_at DESC
      `;
      params = [req.user.id];
    } else {
      query = `
        SELECT 
          k.*, 
          d.nama_lengkap AS nama_pengadu, 
          p.perusahaan AS nama_perusahaan
        FROM kasus k
        LEFT JOIN kasus_data_diri d ON k.id = d.kasus_id
        LEFT JOIN kasus_pelaku_usaha p ON k.id = p.kasus_id
        WHERE k.created_by = ?
        ORDER BY k.created_at DESC
      `;
      params = [req.user.id];
    }

    const [kasusList] = await db.query(query, params);

    res.json(kasusList);
  } catch (err) {
    console.error('Error getAllKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Get detail satu kasus (lengkap)
 */
const getKasusById = async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil data utama dari tabel kasus
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // Hanya pembuat kasus yang boleh melihat, kecuali admin/superadmin
    if (req.user.role === 'user' && kasus.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat kasus orang lain' });

    // Ambil semua data tambahan dari table lain
    const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [id]);
    const [pelakuUsaha] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [id]);
    const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [id]);
    const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [id]);

    // Kalau nanti ada table lain, tinggal tambah query di sini

    res.json({
      ...kasus, // ambil semua kolom dari tabel kasus utama
      data_diri: dataDiri[0] || null,
      pelaku_usaha: pelakuUsaha[0] || null,
      pengaduan: pengaduan[0] || null,
      kronologis: kronologis[0] || null
    });
  } catch (err) {
    console.error('Error getKasusById:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Buat kasus kosong
 */
const createKasus = async (req, res) => {
  const kasusId = uuidv4();

  try {
    await db.query(
      `INSERT INTO kasus (id, created_by, status, created_at) 
       VALUES (?, ?, 'Draf', NOW())`,
      [kasusId, req.user.id]
    );

    // 🔹 Buat entri kosong di semua tabel terkait
    await db.query('INSERT INTO kasus_data_diri (kasus_id) VALUES (?)', [kasusId]);
    await db.query('INSERT INTO kasus_pelaku_usaha (kasus_id) VALUES (?)', [kasusId]);
    await db.query('INSERT INTO kasus_pengaduan (kasus_id) VALUES (?)', [kasusId]);
    await db.query('INSERT INTO kasus_kronologis (kasus_id) VALUES (?)', [kasusId]);

    res.status(201).json({
      message: 'Kasus baru berhasil dibuat',
      kasus_id: kasusId,
    });
  } catch (err) {
    console.error('❌ Error createKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Submit pengaduan (hanya jika semua data lengkap)
 */
const submitKasus = async (req, res) => {
  const { id } = req.params;
  const { konfirmasi } = req.body;

  try {
    // 🔍 Cek apakah kasus ada
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // 🚫 Pastikan hanya pembuat kasus yang bisa submit
    if (kasus.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh submit kasus orang lain' });

    // 🚫 Harus centang konfirmasi
    if (!konfirmasi)
      return res.status(400).json({ message: 'Harus mencentang konfirmasi sebelum submit' });

    // ✅ Ambil semua data terkait
    const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [id]);
    const [pelaku] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [id]);
    const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [id]);
    const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [id]);

    // 🚨 Validasi kelengkapan data diri
    const d = dataDiri[0];
    if (
      !d || !d.nama_lengkap || !d.umur || !d.jenis_kelamin || !d.kota ||
      !d.alamat || !d.email || !d.no_hp || !d.kode_pos || !d.identitas
    ) {
      return res.status(400).json({ message: 'Data diri belum lengkap. Harap lengkapi sebelum submit.' });
    }

    // 🚨 Validasi pelaku usaha
    const p = pelaku[0];
    if (
      !p || !p.nama_pemilik || !p.perusahaan || !p.kota ||
      !p.alamat || !p.kode_pos || !p.no_hp
    ) {
      return res.status(400).json({ message: 'Data pelaku usaha belum lengkap. Harap lengkapi sebelum submit.' });
    }

    // 🚨 Validasi tentang pengaduan
    const t = pengaduan[0];
    if (
      !t || !t.jenis_pengaduan || !t.tanggal_kejadian || !t.waktu_kejadian ||
      !t.lokasi_kejadian
    ) {
      return res.status(400).json({ message: 'Data tentang pengaduan belum lengkap. Harap lengkapi sebelum submit.' });
    }

    // 🚨 Validasi kronologis
    const k = kronologis[0];
    if (!k || !k.kronologis || !k.jenis_tuntutan) {
      return res.status(400).json({ message: 'Data kronologis belum lengkap. Harap lengkapi sebelum submit.' });
    }

    // ✅ Jika semua lengkap → ubah status
    await db.query(`
      UPDATE kasus
      SET status = 'Diproses',
          submitted_at = NOW()
      WHERE id = ?
    `, [id]);

    res.json({
      message: 'Kasus berhasil dikirim dan Diproses',
      kasus_id: id,
      status: 'Diproses'
    });
  } catch (err) {
    console.error('Error submitKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Verifikasi kasus oleh admin/superadmin
 */
const verifyKasus = async (req, res) => {
  const { id } = req.params;
  const { status, alasanPenolakan } = req.body;

  try {
    // Cek apakah kasus ada
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) {
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });
    }

    // Cek role user
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa verifikasi' });
    }

    // Logika verifikasi
    if (status === 'Ditolak') {
      if (!alasanPenolakan) {
        return res.status(400).json({ message: 'Alasan penolakan wajib diisi' });
      }

      await db.query(
        `UPDATE kasus 
         SET status = 'Ditolak', 
             alasan_penolakan = ?, 
             verified_at = NOW(), 
             verified_by = ? 
         WHERE id = ?`,
        [alasanPenolakan, req.user.id, id]
      );
    } else if (status === 'Diterima') {
      await db.query(
        `UPDATE kasus 
         SET status = 'Diterima', 
             verified_at = NOW(), 
             verified_by = ? 
         WHERE id = ?`,
        [req.user.id, id]
      );
    } else {
      return res.status(400).json({ message: 'Status verifikasi tidak valid' });
    }

    // Respons sukses
    res.json({
      message: `Kasus berhasil diverifikasi (${status})`,
      kasus_id: id,
      status,
    });
  } catch (err) {
    console.error('Error verifyKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

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
  getAllKasus,
  getKasusById,
  createKasus,
  submitKasus,
  verifyKasus,
  createSidang,
  getSidangByKasusId,
  updateSidangById
};
