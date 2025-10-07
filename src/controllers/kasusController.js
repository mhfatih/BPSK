const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../db');

/**
 * Buat kasus kosong
 */
const createKasus = async (req, res) => {
  const kasusId = uuidv4();

  try {
    await db.query(
      `INSERT INTO kasus (id, created_by, status, created_at) 
       VALUES (?, ?, 'draf', NOW())`,
      [kasusId, req.user.id]
    );

    res.status(201).json({ message: 'Kasus berhasil dibuat', kasus_id: kasusId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update data diri
 */
const updateDataDiri = async (req, res) => {
  const { id } = req.params;
  const {
    nama_lengkap,
    tanggal_lahir,
    jenis_kelamin,
    kota,
    alamat,
    email,
    no_hp,
    kode_pos,
    identitas,
    use_profile,
  } = req.body;

  try {
    // 🔍 Cek apakah kasus ada
    const [rows_kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rows_kasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus_data = rows_kasus[0];
    if (kasus_data.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
    }

    let data = {};
    let foto_identitas_path = null;

    // Path folder target: uploads/<userId>/kasus/<kasusId>/
    const targetFolder = path.join(__dirname, '..', 'uploads', req.user.id, 'kasus', id);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

    // 🧩 Jika pakai data dari profil pengguna
    if (use_profile === 'true' || use_profile === true) {
      const [profile_rows] = await db.query(
        'SELECT * FROM profiles WHERE user_id = ?',
        [req.user.id]
      );
      if (profile_rows.length === 0)
        return res.status(404).json({ message: 'Profile tidak ditemukan' });

      const profile = profile_rows[0];

      const [user_rows] = await db.query('SELECT email FROM users WHERE id = ?', [req.user.id]);
      if (user_rows.length === 0)
        return res.status(404).json({ message: 'User tidak ditemukan' });

      const user = user_rows[0];

      // Copy foto_identitas dari profile ke folder target
      if (profile.foto_identitas) {
        const srcPath = path.join(__dirname, '..', profile.foto_identitas);
        const ext = path.extname(srcPath);
        const destFilename = `identitas${ext}`;
        const destPath = path.join(targetFolder, destFilename);

        fs.copyFileSync(srcPath, destPath);

        // path selalu pakai forward slash dan diawali /
        foto_identitas_path = '/' + path.relative(path.join(__dirname, '..'), destPath).replace(/\\/g, '/');
      }

      data = {
        nama_lengkap: profile.nama_lengkap,
        tanggal_lahir: profile.tanggal_lahir,
        jenis_kelamin: profile.jenis_kelamin,
        kota: profile.kota,
        alamat: profile.alamat,
        email: user.email,
        no_hp: profile.no_hp,
        kode_pos: profile.kode_pos,
        identitas: profile.identitas,
        foto_identitas: foto_identitas_path,
      };
    } else {
      // 🧾 Input manual
      if (!nama_lengkap || !tanggal_lahir || !jenis_kelamin || !kota || !alamat || !email || !no_hp || !kode_pos || !identitas) {
        return res.status(400).json({ message: 'Semua field data diri wajib diisi' });
      }

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const destFilename = `identitas${ext}`;
        const destPath = path.join(targetFolder, destFilename);

        fs.renameSync(req.file.path, destPath);

        // path selalu pakai forward slash dan diawali /
        foto_identitas_path = '/' + path.relative(path.join(__dirname, '..'), destPath).replace(/\\/g, '/');
      }

      data = {
        nama_lengkap,
        tanggal_lahir,
        jenis_kelamin,
        kota,
        alamat,
        email,
        no_hp,
        kode_pos,
        identitas,
        foto_identitas: foto_identitas_path,
      };
    }

    // 🧠 Tambahkan kasus_id ke object data
    data.kasus_id = id;

    // 🔍 Cek apakah sudah ada data sebelumnya
    const [existing] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [id]);

    if (existing.length > 0) {
      await db.query('UPDATE kasus_data_diri SET ? WHERE kasus_id = ?', [data, id]);
    } else {
      await db.query('INSERT INTO kasus_data_diri SET ?', [data]);
    }

    console.log('Data yang disimpan:', data);

    res.json({
      message: 'Data diri berhasil disimpan',
      kasus_id: id,
      foto_identitas: foto_identitas_path,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update data pelaku usaha
 */
const updatePelakuUsaha = async (req, res) => {
  const { id } = req.params;
  const { nama_pemilik, perusahaan, kota, alamat, kode_pos, no_hp, faksimile } = req.body;

  try {
    // cek kasus
    const [rows_kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rows_kasus.length === 0) {
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });
    }

    const kasus_data = rows_kasus[0];
    if (kasus_data.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
    }

    // validasi
    if (!nama_pemilik || !perusahaan || !kota || !alamat || !kode_pos || !no_hp) {
      return res.status(400).json({ message: 'Semua field pelaku usaha wajib diisi (faksimile opsional)' });
    }

    const data = {
      nama_pemilik,
      perusahaan,
      kota,
      alamat,
      kode_pos,
      no_hp,
      faksimile: faksimile || null
    };

    // cek sudah ada atau belum
    const [existing] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [id]);
    if (existing.length > 0) {
      await db.query('UPDATE kasus_pelaku_usaha SET ? WHERE kasus_id = ?', [data, id]);
    } else {
      await db.query('INSERT INTO kasus_pelaku_usaha SET ?, kasus_id = ?', [data, id]);
    }

    res.json({ message: 'Data pelaku usaha berhasil disimpan', kasus_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update tentang pengaduan
 */
const updateTentangPengaduan = async (req, res) => {
  const { id } = req.params;
  const { jenis_pengaduan, tanggal_kejadian, waktu_kejadian, lokasi, kerugian, bukti_pembelian, bukti_saksi, barang_bukti } = req.body;

  try {
    // cek kasus
    const [rows_kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rows_kasus.length === 0) {
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });
    }

    const kasus_data = rows_kasus[0];
    if (kasus_data.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
    }

    // validasi
    if (!jenis_pengaduan || !tanggal_kejadian || !waktu_kejadian || !lokasi || !kerugian || !bukti_pembelian || !bukti_saksi || !barang_bukti) {
      return res.status(400).json({ message: 'Semua field pengaduan wajib diisi' });
    }

    const data = {
      jenis_pengaduan,
      tanggal_kejadian,
      waktu_kejadian,
      lokasi,
      kerugian,
      bukti_pembelian,
      bukti_saksi,
      barang_bukti
    };

    // cek sudah ada / belum
    const [existing] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [id]);
    if (existing.length > 0) {
      await db.query('UPDATE kasus_pengaduan SET ? WHERE kasus_id = ?', [data, id]);
    } else {
      await db.query('INSERT INTO kasus_pengaduan SET ?, kasus_id = ?', [data, id]);
    }

    res.json({ message: 'Data pengaduan berhasil disimpan', kasus_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update kronologis
 */
const updateKronologis = async (req, res) => {
  const { id } = req.params;
  const { kronologis, jenisTuntutan } = req.body;

  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasusData = rowsKasus[0];
    if (kasusData.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
    }

    if (!kronologis || !jenisTuntutan) {
      return res.status(400).json({ message: 'Kronologis dan jenis tuntutan wajib diisi' });
    }

    const data = { kronologis, jenis_tuntutan: jenisTuntutan };

    const [existing] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [id]);
    if (existing.length > 0) {
      await db.query('UPDATE kasus_kronologis SET ? WHERE kasus_id = ?', [data, id]);
    } else {
      await db.query('INSERT INTO kasus_kronologis SET ?, kasus_id = ?', [data, id]);
    }

    res.json({ message: 'Kronologis berhasil disimpan', kasus_id: id });
  } catch (err) {
    console.error(err);
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
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasusData = rowsKasus[0];
    if (kasusData.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh submit kasus orang lain' });
    }

    if (!konfirmasi) return res.status(400).json({ message: 'Harus centang konfirmasi' });

    await db.query(`UPDATE kasus SET status = 'menunggu verifikasi', submitted_at = NOW() WHERE id = ?`, [id]);

    res.json({ message: 'Kasus berhasil dikirim, menunggu verifikasi', kasus_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Verifikasi kasus oleh admin/superadmin
 */
const verifyKasus = async (req, res) => {
  const { id } = req.params;
  const { status, alasanPenolakan, tanggalSidang, jamSidang } = req.body;

  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Hanya admin/superadmin' });
    }

    if (status === 'ditolak') {
      if (!alasanPenolakan) return res.status(400).json({ message: 'Alasan penolakan wajib' });
      await db.query('UPDATE kasus SET status = ?, alasan_penolakan = ?, verified_at = NOW(), verified_by = ? WHERE id = ?',
        [status, alasanPenolakan, req.user.id, id]);
    } else if (status === 'diterima') {
      if (!tanggalSidang || !jamSidang) return res.status(400).json({ message: 'Tanggal & jam sidang wajib' });
      await db.query('UPDATE kasus SET status = ?, tanggal_sidang = ?, jam_sidang = ?, verified_at = NOW(), verified_by = ? WHERE id = ?',
        [status, tanggalSidang, jamSidang, req.user.id, id]);
    } else {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    res.json({ message: `Kasus berhasil diverifikasi (${status})`, kasus_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Get semua kasus
 */
const getAllKasus = async (req, res) => {
  try {
    let rows;

    if (req.user.role === 'superadmin') {
      [rows] = await db.query('SELECT * FROM kasus');
    } else if (req.user.role === 'admin') {
      [rows] = await db.query(
        "SELECT * FROM kasus WHERE NOT (status = 'draf' AND created_by != ?)",
        [req.user.id]
      );
    } else {
      [rows] = await db.query(
        'SELECT * FROM kasus WHERE created_by = ?',
        [req.user.id]
      );
    }

    // Loop semua kasus
    for (let row of rows) {
      // ambil data diri
      const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [row.id]);
      row.dataDiri = dataDiri;

      // ambil pelaku usaha
      const [pelakuUsaha] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [row.id]);
      row.pelakuUsaha = pelakuUsaha;

      // ambil kronologis
      const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [row.id]);
      row.kronologis = kronologis;

      // ambil pengaduan
      const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [row.id]);
      // untuk tiap pengaduan, ambil bukti
      for (let p of pengaduan) {
        const [bukti] = await db.query('SELECT * FROM kasus_bukti WHERE pengaduan_id = ?', [p.id]);
        p.bukti = bukti;
      }
      row.pengaduan = pengaduan;
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Get kasus by id
 */
const getKasusById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const k = rowsKasus[0];
    if (req.user.role === 'user' && k.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh lihat kasus orang lain' });
    }
    if (req.user.role === 'admin' && k.status === 'draf' && k.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Admin tidak boleh lihat draf orang lain' });
    }

    res.json(k);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  createKasus,
  updateDataDiri,
  updatePelakuUsaha,
  updateTentangPengaduan,
  updateKronologis,
  submitKasus,
  verifyKasus,
  getAllKasus,
  getKasusById,
};
