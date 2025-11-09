const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/mailer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

/**
 * Get semua kasus
 */
const getAllKasus = async (req, res) => {
  try {
    const subquerySidangTerakhir = `
      SELECT s1.kasus_id, s1.hasil_sidang
      FROM kasus_sidang s1
      WHERE (s1.kasus_id, s1.sidang_ke) IN (
        SELECT kasus_id, MAX(sidang_ke)
        FROM kasus_sidang
        GROUP BY kasus_id
      )
    `;

    let baseQuery = `
      SELECT 
        k.id,
        k.status,
        k.wilayah,
        k.pengadu_nama,
        k.jenis_pengaduan,
        k.jumlah_kerugian,
        s.hasil_sidang,
        k.created_at,
        k.created_by,
        k.submitted_at,
        k.verified_at,
        k.verified_by,
        k.processed_at,
        k.processed_by,
        k.finished_at,
        k.finished_by,
        (
          SELECT GROUP_CONCAT(p.perusahaan SEPARATOR ', ')
          FROM kasus_pelaku_usaha p
          WHERE p.kasus_id = k.id
        ) AS perusahaan_list,
        pc.nama AS created_by_name,
        pv.nama AS verified_by_name,
        pp.nama AS processed_by_name,
        pf.nama AS finished_by_name
      FROM kasus k
      LEFT JOIN (${subquerySidangTerakhir}) s ON k.id = s.kasus_id
      LEFT JOIN users uc ON k.created_by = uc.id
      LEFT JOIN profiles pc ON uc.id = pc.user_id
      LEFT JOIN users uv ON k.verified_by = uv.id
      LEFT JOIN profiles pv ON uv.id = pv.user_id
      LEFT JOIN users up ON k.processed_by = up.id
      LEFT JOIN profiles pp ON up.id = pp.user_id
      LEFT JOIN users uf ON k.finished_by = uf.id
      LEFT JOIN profiles pf ON uf.id = pf.user_id
    `;

    let whereClause = '';
    let params = [];

    if (req.user.role === 'superadmin') {
      whereClause = '';
    } else if (req.user.role === 'admin') {
      whereClause = `
        WHERE k.wilayah = ?
          AND NOT (k.status = 'Draf' AND k.created_by != ?)
      `;
      params = [req.user.wilayah, req.user.id];
    } else {
      whereClause = `WHERE k.created_by = ?`;
      params = [req.user.id];
    }

    const finalQuery = `
      ${baseQuery}
      ${whereClause}
      ORDER BY k.created_at DESC
    `;

    const [kasusList] = await db.query(finalQuery, params);

    kasusList.forEach(k => {
      k.perusahaan_list = k.perusahaan_list ? k.perusahaan_list.split(', ') : [];
    });

    res.json(kasusList);
  } catch (err) {
    console.error('Error getAllKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Get detail satu kasus
 */
const getKasusById = async (req, res) => {
  const { id } = req.params;

  try {
    // 🧩 Subquery ambil hasil sidang terakhir
    const subquerySidangTerakhir = `
      SELECT s1.kasus_id, s1.hasil_sidang
      FROM kasus_sidang s1
      INNER JOIN (
        SELECT kasus_id, MAX(sidang_ke) AS sidang_terakhir
        FROM kasus_sidang
        GROUP BY kasus_id
      ) s2 ON s1.kasus_id = s2.kasus_id AND s1.sidang_ke = s2.sidang_terakhir
    `;

    // 🧩 Ambil data utama dari tabel kasus (gabung profil + hasil sidang)
    const [rowsKasus] = await db.query(`
      SELECT 
        k.*, 
        s.hasil_sidang,
        pc.nama AS created_by_name,
        pv.nama AS verified_by_name,
        pp.nama AS processed_by_name,
        pf.nama AS finished_by_name
      FROM kasus k
      LEFT JOIN users uc ON k.created_by = uc.id
      LEFT JOIN profiles pc ON uc.id = pc.user_id
      LEFT JOIN users uv ON k.verified_by = uv.id
      LEFT JOIN profiles pv ON uv.id = pv.user_id
      LEFT JOIN users up ON k.processed_by = up.id
      LEFT JOIN profiles pp ON up.id = pp.user_id
      LEFT JOIN users uf ON k.finished_by = uf.id
      LEFT JOIN profiles pf ON uf.id = pf.user_id
      LEFT JOIN (${subquerySidangTerakhir}) s ON k.id = s.kasus_id
      WHERE k.id = ?
    `, [id]);

    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // 🧩 Hanya pembuat kasus yang boleh melihat, kecuali admin/superadmin
    if (req.user.role === 'user' && kasus.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat kasus orang lain' });

    // 🏢 Ambil semua pelaku usaha terkait
    const [pelakuUsaha] = await db.query(`
      SELECT 
        id,
        perusahaan,
        pemilik,
        kota,
        alamat,
        kode_pos,
        no_hp,
        email
      FROM kasus_pelaku_usaha
      WHERE kasus_id = ?
    `, [id]);

    // 🧾 Susun hasil akhir
    res.json({
      ...kasus,
      pelaku_usaha: pelakuUsaha || []
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
    // 🔹 Buat 1 record baru di tabel kasus utama
    await db.query(
      `INSERT INTO kasus (id, created_by, status, created_at)
       VALUES (?, ?, 'Draf', NOW())`,
      [kasusId, req.user.id]
    );

    // 🔹 Buat pelaku usaha default (1)
    await db.query(
      `INSERT INTO kasus_pelaku_usaha (id, kasus_id)
       VALUES (?, ?)`,
      [uuidv4(), kasusId]
    );

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
 * Submit pengaduan
 */
const submitKasus = async (req, res) => {
  const { id } = req.params;
  const { konfirmasi } = req.body;

  try {
    // 🔍 Ambil data utama kasus
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

    // 🏢 Ambil pelaku usaha utama
    const [pelakuUsaha] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [id]);
    const p = pelakuUsaha[0];

    // 🚨 Validasi kelengkapan data utama (semua kolom di tabel kasus yang wajib)
    if (
      !kasus.pengadu_nama || !kasus.pengadu_umur || !kasus.pengadu_jenis_kelamin || !kasus.pengadu_kota ||
      !kasus.pengadu_alamat || !kasus.pengadu_email || !kasus.pengadu_no_hp || !kasus.pengadu_kode_pos ||
      !kasus.pengadu_identitas || !kasus.jenis_pengaduan || !kasus.tanggal_kejadian || !kasus.waktu_kejadian ||
      !kasus.lokasi_kejadian || !kasus.kronologis || !kasus.jenis_tuntutan
    ) {
      return res.status(400).json({ message: 'Data kasus belum lengkap. Harap lengkapi semua sebelum submit.' });
    }

    // 🚨 Validasi pelaku usaha
    if (!p || !p.perusahaan || !p.kota || !p.alamat || !p.kode_pos || (!p.email && !p.no_hp)) {
      return res.status(400).json({ message: 'Data pelaku usaha belum lengkap. Harap lengkapi sebelum submit.' });
    }

    // ✅ Jika semua lengkap → ubah status
    await db.query(`
      UPDATE kasus
      SET status = 'Diverifikasi',
          submitted_at = NOW()
      WHERE id = ?
    `, [id]);

    // 📧 Kirim email notifikasi ke pengadu
    await sendEmail(
      kasus.pengadu_email,
      'Pengaduan Berhasil Dikirim',
      `
      <h3>Halo ${kasus.pengadu_nama},</h3>
      <p>Terima kasih telah mengirimkan pengaduan Anda melalui sistem kami.</p>
      <p>Status pengaduan Anda saat ini: <b>Diverifikasi</b>.</p>
      <p>Kami akan segera menindaklanjuti laporan Anda. Paling lama 3 x 24 jam kerja.</p>
      <hr/>
      <p><b>ID Kasus:</b> ${id}</p>
      <p><b>Jenis Pengaduan:</b> ${kasus.jenis_pengaduan}</p>
      <p><i>Email ini dikirim otomatis, mohon tidak dibalas.</i></p>
      `
    );

    // 📧 Kirim email ke semua admin & superadmin
    try {
      const wilayahKasus = kasus.wilayah;
      const [admins] = await db.query(`
        SELECT email FROM users
        WHERE (role = 'admin' AND wilayah = ?) OR role = 'superadmin'
      `, [wilayahKasus]);

      const adminEmails = admins.map(a => a.email);
      if (adminEmails.length > 0) {
        await sendEmail(
          adminEmails.join(','),
          'Pengaduan Baru Diterima',
          `
          <h3>Halo Admin & Superadmin,</h3>
          <p>Ada pengaduan baru yang telah dikirim oleh <b>${kasus.pengadu_nama}</b>.</p>
          <p>Wilayah kasus: <b>${wilayahKasus}</b></p>
          <p>Mohon untuk segera meninjau dan memproses pengaduan di sistem.</p>
          <hr/>
          <p><b>ID Kasus:</b> ${id}</p>
          <p><b>Jenis Pengaduan:</b> ${kasus.jenis_pengaduan}</p>
          <p><b>Status:</b> Diverifikasi</p>
          <p><i>Email ini dikirim otomatis, mohon tidak dibalas.</i></p>
          `
        );
      }
    } catch (err) {
      console.error('❌ Gagal kirim notifikasi ke admin/superadmin:', err);
    }

    res.json({
      message: 'Kasus berhasil dikirim dan Diverifikasi',
      kasus_id: id,
      status: 'Diverifikasi'
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
  const { status, alasanPenolakan, no_registrasi } = req.body;

  try {
    // 🔍 Ambil data utama kasus
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) {
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });
    }

    const kasus = rowsKasus[0];

    // 🚫 Hanya admin/superadmin yang boleh verifikasi
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa verifikasi' });
    }

    // 🧭 Cek kesesuaian wilayah jika role = admin
    if (req.user.role === 'admin') {
      const adminWilayah = req.user.wilayah;
      if (adminWilayah && kasus.wilayah !== adminWilayah) {
        return res.status(403).json({
          message: `Admin hanya boleh verifikasi kasus di wilayah ${adminWilayah}`,
        });
      }
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

      // 📧 Kirim email ke pengadu
      if (kasus.pengadu_email) {
        await sendEmail(
          kasus.pengadu_email,
          'Hasil Verifikasi Pengaduan Anda',
          `
          <h3>Halo ${kasus.pengadu_nama},</h3>
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
      if (!no_registrasi) {
        return res.status(400).json({ message: 'Nomor registrasi wajib diisi untuk status Diterima' });
      }

      await db.query(
        `UPDATE kasus 
         SET status = 'Diterima', 
             no_registrasi = ?, 
             verified_at = NOW(), 
             verified_by = ? 
         WHERE id = ?`,
        [no_registrasi, req.user.id, id]
      );

      // 📧 Kirim email ke pengadu
      if (kasus.pengadu_email) {
        await sendEmail(
          kasus.pengadu_email,
          'Hasil Verifikasi Pengaduan Anda',
          `
          <h3>Halo ${kasus.pengadu_nama},</h3>
          <p>Pengaduan Anda dengan ID Kasus <b>${id}</b> telah diverifikasi oleh admin.</p>
          <p>Status saat ini: <b style="color:green;">DITERIMA</b></p>
          <p><b>Nomor Registrasi:</b> ${no_registrasi}</p>
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
      no_registrasi: status === 'Diterima' ? no_registrasi : null
    });
  } catch (err) {
    console.error('Error verifyKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Proses kasus oleh admin/superadmin
 */
const prosesKasus = async (req, res) => {
  const { id } = req.params;

  try {
    // 🔍 Cek apakah kasus ada
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // 🚫 Hanya admin/superadmin yang bisa memproses
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa memproses kasus' });
    }

    // 🧭 Admin hanya boleh memproses kasus di wilayahnya sendiri
    if (req.user.role === 'admin') {
      const adminWilayah = req.user.wilayah;
      if (adminWilayah && kasus.wilayah !== adminWilayah) {
        return res.status(403).json({
          message: `Admin hanya boleh memproses kasus di wilayah ${adminWilayah}`,
        });
      }
    }

    // 🚫 Hanya bisa diproses kalau status-nya "Diterima"
    if (kasus.status !== 'Diterima') {
      return res.status(400).json({
        message: 'Kasus hanya dapat diproses jika status-nya adalah Diterima',
      });
    }

    // 🔁 Ubah status jadi "Diproses"
    await db.query(
      `UPDATE kasus 
       SET status = 'Diproses',
           processed_at = NOW(),
           processed_by = ?
       WHERE id = ?`,
      [req.user.id, id]
    );

    // 📧 Kirim email notifikasi ke pelapor
    if (kasus.pengadu_email) {
      await sendEmail(
        kasus.pengadu_email,
        'Status Pengaduan Anda Telah Diproses',
        `
        <h3>Halo ${kasus.pengadu_nama},</h3>
        <p>Pengaduan Anda dengan ID Kasus <b>${id}</b> saat ini sedang dalam proses penanganan oleh tim BPSK.</p>
        <p>Status saat ini: <b style="color:blue;">DIPROSES</b></p>
        <p>Kami akan menghubungi Anda kembali jika diperlukan informasi tambahan.</p>
        <hr/>
        <p><i>Email ini dikirim otomatis oleh sistem, mohon tidak dibalas.</i></p>
        `
      );
    }

    // ✅ Respons sukses
    res.json({
      message: 'Kasus berhasil diubah menjadi status Diproses',
      kasus_id: id,
      status: 'Diproses',
    });
  } catch (err) {
    console.error('Error prosesKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Selesaikan kasus oleh admin/superadmin
 */
const selesaiKasus = async (req, res) => {
  const { id } = req.params;
  const { jumlah_kerugian } = req.body;

  try {
    // 🔍 Cek apakah kasus ada
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // 🚫 Hanya admin/superadmin yang bisa menyelesaikan kasus
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa menyelesaikan kasus' });
    }

    // 🚫 Hanya bisa diselesaikan kalau status-nya "Diproses"
    if (kasus.status !== 'Diproses') {
      return res.status(400).json({
        message: 'Kasus hanya dapat diselesaikan jika status-nya adalah Diproses',
      });
    }

    // 🚨 Validasi jumlah kerugian
    if (jumlah_kerugian === undefined || jumlah_kerugian === null || jumlah_kerugian === '') {
      return res.status(400).json({ message: 'Jumlah kerugian wajib diisi' });
    }

    // 🔁 Ubah status jadi "Selesai"
    await db.query(
      `UPDATE kasus 
       SET status = 'Selesai',
           jumlah_kerugian = ?,
           finished_at = NOW(),
           finished_by = ?
       WHERE id = ?`,
      [jumlah_kerugian, req.user.id, id]
    );

    // 📧 Kirim email notifikasi ke pelapor langsung dari tabel kasus
    if (kasus.pengadu_email) {
      await sendEmail(
        kasus.pengadu_email,
        'Kasus Anda Telah Selesai',
        `
        <h3>Halo ${kasus.pengadu_nama},</h3>
        <p>Kasus Anda dengan ID <b>${id}</b> telah selesai diproses oleh tim BPSK.</p>
        <p>Status akhir: <b style="color:green;">SELESAI</b></p>
        <p><b>Jumlah Kerugian:</b> Rp ${Number(jumlah_kerugian).toLocaleString('id-ID')}</p>
        <p>Terima kasih atas partisipasi Anda dalam menyelesaikan pengaduan ini.</p>
        <hr/>
        <p><i>Email ini dikirim otomatis oleh sistem, mohon tidak dibalas.</i></p>
        `
      );
    }

    // ✅ Respons sukses
    res.json({
      message: 'Kasus berhasil diselesaikan',
      kasus_id: id,
      status: 'Selesai',
      jumlah_kerugian,
    });
  } catch (err) {
    console.error('Error selesaiKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  getAllKasus,
  getKasusById,
  createKasus,
  submitKasus,
  verifyKasus,
  prosesKasus,
  selesaiKasus
};
