const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/mailer');
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
      // 🟩 Superadmin: bisa melihat semua kasus
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
      // 🟦 Admin: hanya bisa melihat kasus sesuai wilayah admin-nya
      query = `
        SELECT 
          k.*, 
          d.nama_lengkap AS nama_pengadu, 
          p.perusahaan AS nama_perusahaan
        FROM kasus k
        LEFT JOIN kasus_data_diri d ON k.id = d.kasus_id
        LEFT JOIN kasus_pelaku_usaha p ON k.id = p.kasus_id
        WHERE k.wilayah = ?
          AND NOT (k.status = 'Draf' AND k.created_by != ?)
        ORDER BY k.created_at DESC
      `;
      params = [req.user.wilayah, req.user.id];
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

    // 📧 Kirim email notifikasi pakai helper
    await sendEmail(
      d.email,
      'Pengaduan Berhasil Dikirim',
      `
      <h3>Halo ${d.nama_lengkap},</h3>
      <p>Terima kasih telah mengirimkan pengaduan Anda melalui sistem kami.</p>
      <p>Status pengaduan Anda saat ini: <b>Diproses</b>.</p>
      <p>Kami akan segera menindaklanjuti laporan Anda. Paling lama 3 x 24 jam kerja.</p>
      <hr/>
      <p><b>ID Kasus:</b> ${id}</p>
      <p><b>Jenis Pengaduan:</b> ${t.jenis_pengaduan}</p>
      <p><i>Email ini dikirim otomatis, mohon tidak dibalas.</i></p>
      `
    );

    // 📧 Kirim email ke semua admin & superadmin sekaligus
    try {
      // Ambil semua admin dan superadmin
      const [admins] = await db.query(`
        SELECT email FROM users
        WHERE role IN ('admin', 'superadmin')
      `);

      // Ambil semua email admin jadi satu array
      const adminEmails = admins.map(a => a.email);

      if (adminEmails.length > 0) {
        await sendEmail(
          adminEmails.join(','),
          'Pengaduan Baru Diterima',
          `
          <h3>Halo Admin & Superadmin,</h3>
          <p>Ada pengaduan baru yang telah dikirim oleh <b>${d.nama_lengkap}</b>.</p>
          <p>Mohon untuk segera meninjau dan memproses pengaduan di sistem.</p>
          <hr/>
          <p><b>ID Kasus:</b> ${id}</p>
          <p><b>Jenis Pengaduan:</b> ${t.jenis_pengaduan}</p>
          <p><b>Status:</b> Diproses</p>
          <p><i>Email ini dikirim otomatis, mohon tidak dibalas.</i></p>
          `
        );

        console.log(`📨 Notifikasi terkirim ke semua admin/superadmin (${adminEmails.length} penerima)`);
      } else {
        console.log('⚠️ Tidak ada admin/superadmin yang terdaftar.');
      }
    } catch (err) {
      console.error('❌ Gagal kirim notifikasi ke admin/superadmin:', err);
    }

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
    // 🔍 Cek apakah kasus ada
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) {
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });
    }

    const kasus = rowsKasus[0];

    // 🚫 Hanya admin/superadmin yang boleh verifikasi
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa verifikasi' });
    }

    // 🔍 Ambil data diri pelapor (untuk kirim email)
    const [dataDiri] = await db.query(
      'SELECT nama_lengkap, email FROM kasus_data_diri WHERE kasus_id = ?',
      [id]
    );

    const pelapor = dataDiri[0];

    if (!pelapor || !pelapor.email) {
      console.warn('⚠️ Tidak ditemukan email pelapor untuk kasus ID:', id);
    }

    // 🔁 Proses verifikasi
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

      // 📧 Kirim email ke pelapor kalau email ada
      if (pelapor?.email) {
        await sendEmail(
          pelapor.email,
          'Hasil Verifikasi Pengaduan Anda',
          `
          <h3>Halo ${pelapor.nama_lengkap},</h3>
          <p>Pengaduan Anda dengan ID Kasus <b>${id}</b> telah diverifikasi oleh admin.</p>
          <p>Status saat ini: <b style="color:red;">DITOLAK</b></p>
          <p><b>Alasan Penolakan:</b> ${alasanPenolakan}</p>
          <hr/>
          <p><i>Email ini dikirim otomatis oleh sistem, mohon tidak dibalas.</i></p>
          `
        );
      }
    } 
    else if (status === 'Diterima') {
      await db.query(
        `UPDATE kasus 
         SET status = 'Diterima', 
             verified_at = NOW(), 
             verified_by = ? 
         WHERE id = ?`,
        [req.user.id, id]
      );

      // 📧 Kirim email ke pelapor kalau email ada
      if (pelapor?.email) {
        await sendEmail(
          pelapor.email,
          'Hasil Verifikasi Pengaduan Anda',
          `
          <h3>Halo ${pelapor.nama_lengkap},</h3>
          <p>Pengaduan Anda dengan ID Kasus <b>${id}</b> telah diverifikasi oleh admin.</p>
          <p>Status saat ini: <b style="color:green;">DITERIMA</b></p>
          <p>Terima kasih atas partisipasi Anda dalam melaporkan pengaduan.</p>
          <hr/>
          <p><i>Email ini dikirim otomatis oleh sistem, mohon tidak dibalas.</i></p>
          `
        );
      }
    } 
    else {
      return res.status(400).json({ message: 'Status verifikasi tidak valid' });
    }

    // ✅ Respons sukses
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

module.exports = {
  getAllKasus,
  getKasusById,
  createKasus,
  submitKasus,
  verifyKasus,
};
