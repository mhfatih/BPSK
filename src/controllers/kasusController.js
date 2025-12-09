const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../utils/mailer');
const { uploader, deleteOldFile } = require('../utils/uploader');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

/**
 * Get Dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const { tahun } = req.query;

    // Jika ada tahun → filter
    const whereKasus = tahun ? `WHERE YEAR(created_at) = ${db.escape(tahun)}` : '';
    const whereSidang = tahun ? `WHERE YEAR(tanggal_sidang) = ${db.escape(tahun)}` : '';
    const wherePelaku = tahun
      ? `WHERE kasus_id IN (SELECT id FROM kasus WHERE YEAR(created_at) = ${db.escape(tahun)})`
      : '';

    // 🔹 Total kasus
    const [[totalKasus]] = await db.query(`
      SELECT COUNT(*) AS total_kasus 
      FROM kasus
      ${whereKasus}
    `);

    // 🔹 Jumlah kasus per status
    const [statusStats] = await db.query(`
      SELECT status, COUNT(*) AS jumlah
      FROM kasus
      ${whereKasus}
      GROUP BY status
    `);

    // 🔹 Jumlah kasus per wilayah
    const [wilayahStats] = await db.query(`
      SELECT wilayah, COUNT(*) AS jumlah
      FROM kasus
      ${whereKasus}
      GROUP BY wilayah
    `);

    // 🔹 Jumlah kasus per jenis pengaduan
    const [jenisStats] = await db.query(`
      SELECT jenis_pengaduan, COUNT(*) AS jumlah
      FROM kasus
      ${whereKasus}
      GROUP BY jenis_pengaduan
    `);

    // 🔹 Total dan rata-rata kerugian
    const [[kerugianStats]] = await db.query(`
      SELECT 
        SUM(jumlah_kerugian) AS total_kerugian,
        AVG(jumlah_kerugian) AS rata_kerugian
      FROM kasus
      ${whereKasus ? whereKasus + ' AND jumlah_kerugian IS NOT NULL' : 'WHERE jumlah_kerugian IS NOT NULL'}
    `);

    // 🔹 Jumlah sidang per bulan
    const [sidangStats] = await db.query(`
      SELECT 
        DATE_FORMAT(tanggal_sidang, '%Y-%m') AS bulan,
        COUNT(*) AS jumlah
      FROM kasus_sidang
      ${whereSidang}
      GROUP BY DATE_FORMAT(tanggal_sidang, '%Y-%m')
      ORDER BY bulan DESC
      LIMIT 12
    `);

    // 🔹 Jumlah perusahaan unik dalam kasus tahun itu
    const [[perusahaanStats]] = await db.query(`
      SELECT COUNT(DISTINCT perusahaan) AS total_perusahaan
      FROM kasus_pelaku_usaha
      ${wherePelaku}
    `);

    // 🔹 Jika user minta: ambil daftar semua tahun yg ada
    const [tahunList] = await db.query(`
      SELECT DISTINCT YEAR(created_at) AS tahun
      FROM kasus
      ORDER BY tahun DESC
    `);

    // ==== Final Response ====
    res.json({
      filter_tahun: tahun || 'all',
      tahun_tersedia: tahunList,
      total_kasus: totalKasus.total_kasus,
      status: statusStats,
      wilayah: wilayahStats,
      jenis_pengaduan: jenisStats,
      kerugian: kerugianStats,
      sidang_per_bulan: sidangStats,
      total_perusahaan: perusahaanStats.total_perusahaan
    });

  } catch (err) {
    console.error('Error getDashboard:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

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
        k.no_registrasi,
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
    // 🧩 Subquery ambil hasil sidang terakhir + metode penyelesaian
    const subquerySidangTerakhir = `
      SELECT s1.kasus_id, s1.hasil_sidang, s1.metode_penyelesaian
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
        s.metode_penyelesaian,
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
      SELECT * 
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
 * Get status kasus saja
 */
const getKasusStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT id, status, created_by FROM kasus WHERE id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Kasus tidak ditemukan" });

    const kasus = rows[0];

    // 👮 Jika user biasa, hanya boleh melihat status kasusnya sendiri
    if (req.user.role === "user" && kasus.created_by !== req.user.id)
      return res.status(403).json({ message: "Tidak boleh mengakses kasus orang lain" });

    // ⬅ FIX: now include created_by
    res.json({
      id: kasus.id,
      status: kasus.status,
      created_by: kasus.created_by,
    });

  } catch (err) {
    console.error("Error getKasusStatus:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
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

    // 🚨 Validasi kelengkapan data utama
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

    // Email ke pengadu
    setImmediate(() => {
      sendEmail(
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
      ).catch(err => console.error('❌ Email ke pengadu gagal:', err));
    });

    // Email ke admin/superadmin
    setImmediate(async () => {
      try {
        const [admins] = await db.query(`
          SELECT email FROM users
          WHERE (role = 'admin' AND wilayah = ?) OR role = 'superadmin'
        `, [kasus.wilayah]);

        const adminEmails = admins.map(a => a.email);
        if (adminEmails.length > 0) {
          sendEmail(
            adminEmails.join(','),
            'Pengaduan Baru Diterima',
            `
            <h3>Halo Admin & Superadmin,</h3>
            <p>Ada pengaduan baru yang telah dikirim oleh <b>${kasus.pengadu_nama}</b>.</p>
            <p>Wilayah kasus: <b>${kasus.wilayah}</b></p>
            <p>Mohon untuk segera meninjau dan memproses pengaduan di sistem.</p>
            <hr/>
            <p><b>ID Kasus:</b> ${id}</p>
            <p><b>Jenis Pengaduan:</b> ${kasus.jenis_pengaduan}</p>
            <p><b>Status:</b> Diverifikasi</p>
            <p><i>Email ini dikirim otomatis, mohon tidak dibalas.</i></p>
            `
          ).catch(err => console.error('❌ Email admin gagal:', err));
        }
      } catch (err) {
        console.error('❌ Gagal mengambil admin:', err);
      }
    });

    return res.json({
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

    // 🧭 Cek wilayah admin
    if (req.user.role === 'admin') {
      const adminWilayah = req.user.wilayah;
      if (adminWilayah && kasus.wilayah !== adminWilayah) {
        return res.status(403).json({
          message: `Admin hanya boleh verifikasi kasus di wilayah ${adminWilayah}`,
        });
      }
    }

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

      // 📧 Non-blocking email ke pengadu
      if (kasus.pengadu_email) {
        setImmediate(() => {
          sendEmail(
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
          ).catch(err => console.error('❌ Email Ditolak gagal:', err));
        });
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

      // 📧 Non-blocking email ke pengadu
      if (kasus.pengadu_email) {
        setImmediate(() => {
          sendEmail(
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
          ).catch(err => console.error('❌ Email Diterima gagal:', err));
        });
      }
    }

    // ❌ Status tidak valid
    else {
      return res.status(400).json({ message: 'Status verifikasi tidak valid' });
    }

    return res.json({
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

    // 🔎 Cek jumlah sidang yang sudah ada
    const [existingSidang] = await db.query(
      'SELECT COUNT(*) AS count FROM kasus_sidang WHERE kasus_id = ?',
      [id]
    );

    const sidangKe = existingSidang[0].count + 1;

    const sidangId = uuidv4();

    // 🆕 Buat sidang kosong pertama
    await db.query(
      `INSERT INTO kasus_sidang 
        (id, kasus_id, sidang_ke, created_at)
       VALUES (?, ?, ?, NOW())`,
      [sidangId, id, sidangKe]
    );

    if (kasus.pengadu_email) {
      sendEmail(
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
      ).catch(err => {
        console.error("❌ Gagal mengirim email prosesKasus:", err);
      });
    }

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
 *  Selesaikan kasus oleh admin/superadmin
 */
const selesaiKasus = async (req, res) => {
  const { id } = req.params;

  // 📂 Konfigurasi upload file sidang
  const upload = uploader(`kasus/${id}`, 'file_sidang', {
    maxSize: 5 * 1024 * 1024, // Maks 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  }).single('file_sidang');

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Ukuran file terlalu besar (maksimal 5MB)' });
      }
      if (err.message === 'Jenis file tidak diizinkan') {
        return res.status(400).json({ message: 'Jenis file tidak diizinkan (hanya PDF, JPG, PNG)' });
      }
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file sidang' });
    }

    const { jumlah_kerugian } = req.body;

    try {
      // 🔍 Cek apakah kasus ada
      const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
      if (rowsKasus.length === 0)
        return res.status(404).json({ message: 'Kasus tidak ditemukan' });

      const kasus = rowsKasus[0];

      // 🚫 Validasi role user
      if (!['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa menyelesaikan kasus' });
      }

      // 🚫 Status harus Diproses
      if (kasus.status !== 'Diproses') {
        return res.status(400).json({ message: 'Kasus hanya dapat diselesaikan jika status-nya adalah Diproses' });
      }

      // 🚨 Validasi jumlah kerugian
      if (!jumlah_kerugian && jumlah_kerugian !== 0) {
        return res.status(400).json({ message: 'Jumlah kerugian wajib diisi' });
      }

      // 🔧 Data update kasus
      const updateData = {
        status: 'Selesai',
        jumlah_kerugian,
        finished_at: new Date(),
        finished_by: req.user.id,
      };

      // 📎 Jika admin upload file sidang
      if (req.file) {
        // Hapus file lama
        if (kasus.file_sidang) deleteOldFile(kasus.file_sidang);

        updateData.file_sidang = req.file.path
          .replace(/\\/g, '/')
          .replace(/^.*uploads/, '/uploads');
      }

      // 🔁 Update database
      await db.query('UPDATE kasus SET ? WHERE id = ?', [updateData, id]);

      if (kasus.pengadu_email) {
        sendEmail(
          kasus.pengadu_email,
          'Kasus Anda Telah Selesai',
          `
          <h3>Halo ${kasus.pengadu_nama},</h3>
          <p>Kasus Anda dengan ID <b>${id}</b> telah selesai diproses oleh tim BPSK.</p>
          <p>Status akhir: <b style="color:green;">SELESAI</b></p>
          <p><b>Jumlah Kerugian:</b> Rp ${Number(jumlah_kerugian).toLocaleString('id-ID')}</p>
          ${updateData.file_sidang
            ? `<p>📎 File hasil sidang telah diunggah dan dapat dilihat di halaman kasus Anda.</p>`
            : ''
          }
          <p>Terima kasih atas partisipasi Anda dalam proses pengaduan ini.</p>
          <hr/>
          <p><i>Email ini dikirim otomatis oleh sistem, mohon tidak dibalas.</i></p>
          `
        ).catch(err => {
          console.error('❌ Gagal mengirim email selesaiKasus:', err);
        });
      }

      res.json({
        message: 'Kasus berhasil diselesaikan',
        kasus_id: id,
        status: 'Selesai',
        jumlah_kerugian,
        file_sidang: updateData.file_sidang || kasus.file_sidang || null,
      });

    } catch (err) {
      console.error('Error selesaiKasus:', err);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  });
};

/**
 *  Selesaikan kasus (versi temp) oleh admin/superadmin
 */
const selesaiKasusTemp = async (req, res) => {
  const { id } = req.params;

  // 📂 Upload file sidang
  const upload = uploader(`kasus/${id}`, 'file_sidang', {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  }).single('file_sidang');

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Ukuran file terlalu besar (maksimal 5MB)' });
      }
      if (err.message === 'Jenis file tidak diizinkan') {
        return res.status(400).json({ message: 'Jenis file tidak diizinkan (PDF, JPG, PNG)' });
      }
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file sidang' });
    }

    const { jumlah_kerugian, metode_penyelesaian, hasil_sidang } = req.body;

    try {
      // 🔍 Ambil kasus
      const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
      if (rowsKasus.length === 0)
        return res.status(404).json({ message: 'Kasus tidak ditemukan' });

      const kasus = rowsKasus[0];

      // 🛡 Validasi role
      if (!['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa menyelesaikan kasus' });
      }

      // 🛑 Status harus Diproses
      if (kasus.status !== 'Diproses') {
        return res.status(400).json({ message: 'Kasus hanya dapat diselesaikan jika status-nya adalah Diproses' });
      }

      // 🧾 Validasi input
      if (!jumlah_kerugian) {
        return res.status(400).json({ message: 'Jumlah kerugian wajib diisi' });
      }

      if (!metode_penyelesaian || !hasil_sidang) {
        return res.status(400).json({
          message: 'metode_penyelesaian dan hasil_sidang wajib diisi'
        });
      }

      // 🔎 Cari sidang terakhir
      const [sidangRows] = await db.query(
        'SELECT * FROM kasus_sidang WHERE kasus_id = ? ORDER BY sidang_ke DESC LIMIT 1',
        [id]
      );

      if (sidangRows.length === 0) {
        return res.status(400).json({
          message: 'Belum ada data sidang untuk kasus ini'
        });
      }

      const sidang = sidangRows[0];

      // 📝 Update sidang (tanpa file)
      await db.query(
        'UPDATE kasus_sidang SET metode_penyelesaian = ?, hasil_sidang = ?, updated_at = ? WHERE id = ?',
        [metode_penyelesaian, hasil_sidang, new Date(), sidang.id]
      );

      // 📌 Siapkan update kasus
      const updateData = {
        status: 'Selesai',
        jumlah_kerugian,
        finished_at: new Date(),
        finished_by: req.user.id,
      };

      // 📎 Jika upload file → simpan ke tabel kasus
      if (req.file) {
        const newPath = req.file.path.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads');

        if (kasus.file_sidang) deleteOldFile(kasus.file_sidang);

        updateData.file_sidang = newPath;
      }

      // 🔁 Update tabel kasus
      await db.query('UPDATE kasus SET ? WHERE id = ?', [updateData, id]);

      // 📧 Kirim email non-blocking
      if (kasus.pengadu_email) {
        sendEmail(
          kasus.pengadu_email,
          'Kasus Anda Telah Selesai',
          `
          <h3>Halo ${kasus.pengadu_nama},</h3>
          <p>Kasus Anda dengan ID <b>${id}</b> telah selesai diproses.</p>

          <p><b>Jumlah Kerugian:</b> Rp ${Number(jumlah_kerugian).toLocaleString('id-ID')}</p>
          <p><b>Metode Penyelesaian:</b> ${metode_penyelesaian}</p>
          <p><b>Hasil Sidang:</b> ${hasil_sidang}</p>

          ${updateData.file_sidang
            ? `<p>📎 File hasil sidang telah diunggah ke sistem.</p>`
            : ''}

          <hr/>
          <p><i>Email ini dikirim otomatis oleh sistem, mohon tidak dibalas.</i></p>
          `
        ).catch(err => console.error("Email gagal:", err));
      }

      // 🟢 Response sukses
      res.json({
        message: 'Kasus berhasil diselesaikan',
        kasus_id: id,
        status: 'Selesai',
        metode_penyelesaian,
        hasil_sidang,
        jumlah_kerugian,
        file_sidang: updateData.file_sidang || kasus.file_sidang || null,
      });

    } catch (err) {
      console.error('Error selesaiKasus:', err);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  });
};

module.exports = {
  getDashboard,
  getAllKasus,
  getKasusById,
  getKasusStatus,
  createKasus,
  submitKasus,
  verifyKasus,
  prosesKasus,
  selesaiKasus,
  selesaiKasusTemp
};
