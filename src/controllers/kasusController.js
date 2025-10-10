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
 * Update data diri (versi umur integer)
 */
const updateDataDiri = async (req, res) => {
  const { id } = req.params;
  const {
    nama_lengkap,
    umur,
    jenis_kelamin,
    kota,
    alamat,
    email,
    no_hp,
    kode_pos,
    identitas,
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

    // 🧩 Validasi input wajib
    if (
      !nama_lengkap || !umur || !jenis_kelamin || !kota ||
      !alamat || !email || !no_hp || !kode_pos || !identitas
    ) {
      return res.status(400).json({ message: 'Semua field data diri wajib diisi' });
    }

    // 📂 Folder penyimpanan file
    const targetFolder = path.join(__dirname, '..', 'uploads', req.user.id, 'kasus', id);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

    let foto_identitas_path = null;

    // 📸 Simpan foto baru (kalau ada)
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const destFilename = `identitas${ext}`;
      const destPath = path.join(targetFolder, destFilename);
      fs.renameSync(req.file.path, destPath);
      foto_identitas_path = '/' + path.relative(path.join(__dirname, '..'), destPath).replace(/\\/g, '/');
    }

    // 💾 Data yang akan disimpan
    const data = {
      kasus_id: id,
      nama_lengkap,
      umur: parseInt(umur, 10),
      jenis_kelamin,
      kota,
      alamat,
      email,
      no_hp,
      kode_pos,
      identitas,
      foto_identitas: foto_identitas_path,
    };

    // 🔍 Cek apakah data sudah ada sebelumnya
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
 * Update tentang pengaduan (langsung ke tabel kasus_pengaduan)
 */
const updateTentangPengaduan = async (req, res) => {
  const { id } = req.params;
  const {
    jenis_pengaduan,
    tanggal_kejadian,
    waktu_kejadian,
    lokasi_kejadian,
    jenis_kerugian,
    keterangan_kerugian,
    bukti_pembelian,
    bukti_saksi,
    hubungan_saksi,
    barang_bukti,
  } = req.body;

  try {
    // 🔍 Cek apakah kasus utama ada
    const [rows_kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rows_kasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus_data = rows_kasus[0];
    if (kasus_data.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });

    // ✅ Validasi field wajib
    if (!jenis_pengaduan || !tanggal_kejadian || !waktu_kejadian || !lokasi_kejadian)
      return res.status(400).json({ message: 'Field wajib tidak lengkap' });

    // 🧾 Siapkan data untuk update
    const pengaduanData = {
      jenis_pengaduan,
      tanggal_kejadian,
      waktu_kejadian,
      lokasi_kejadian,
      jenis_kerugian,
      keterangan_kerugian: keterangan_kerugian || null,
      bukti_pembelian: bukti_pembelian || null,
      bukti_saksi: bukti_saksi || null,
      hubungan_saksi: bukti_saksi === 'ada' ? hubungan_saksi || null : null,
      barang_bukti: barang_bukti || null,
    };

    // 📸 Tangani upload foto
    if (req.file) {
      // Ambil data lama (kalau ada foto lama)
      const [existing] = await db.query('SELECT foto_bukti FROM kasus_pengaduan WHERE kasus_id = ?', [id]);
      if (existing.length > 0 && existing[0].foto_bukti) {
        const oldPath = path.join(__dirname, '..', existing[0].foto_bukti);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
            console.log('🧹 Foto bukti lama dihapus:', oldPath);
          } catch (err) {
            console.error('Gagal hapus foto lama:', err);
          }
        }
      }

      // Simpan path baru
      pengaduanData.foto_bukti = req.file.path
        .replace(/\\/g, '/')
        .replace(/^.*uploads/, '/uploads');
    }

    // 💾 Cek apakah sudah ada record di kasus_pengaduan
    const [existingPengaduan] = await db.query(
      'SELECT kasus_id FROM kasus_pengaduan WHERE kasus_id = ?',
      [id]
    );

    if (existingPengaduan.length > 0) {
      await db.query('UPDATE kasus_pengaduan SET ? WHERE kasus_id = ?', [pengaduanData, id]);
    } else {
      await db.query('INSERT INTO kasus_pengaduan SET ?, kasus_id = ?', [pengaduanData, id]);
    }

    res.json({
      message: 'Data pengaduan berhasil disimpan',
      kasus_id: id,
      data: pengaduanData,
    });
  } catch (err) {
    console.error('Error saat update pengaduan:', err);
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
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];
    if (kasus.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh submit kasus orang lain' });

    if (!konfirmasi)
      return res.status(400).json({ message: 'Harus mencentang konfirmasi sebelum submit' });

    // ✅ Update status ke menunggu verifikasi
    await db.query(`
      UPDATE kasus
      SET status = 'menunggu verifikasi', submitted_at = NOW()
      WHERE id = ?
    `, [id]);

    res.json({
      message: 'Kasus berhasil dikirim dan menunggu verifikasi',
      kasus_id: id,
      status: 'menunggu verifikasi'
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
  const { status, alasanPenolakan, tanggalSidang, jamSidang } = req.body;

  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];
    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa verifikasi' });

    if (status === 'ditolak') {
      if (!alasanPenolakan)
        return res.status(400).json({ message: 'Alasan penolakan wajib diisi' });

      await db.query(`
        UPDATE kasus
        SET status = 'ditolak', alasan_penolakan = ?, verified_at = NOW(), verified_by = ?
        WHERE id = ?
      `, [alasanPenolakan, req.user.id, id]);
    } else if (status === 'diterima') {
      if (!tanggalSidang || !jamSidang)
        return res.status(400).json({ message: 'Tanggal dan jam sidang wajib diisi' });

      await db.query(`
        UPDATE kasus
        SET status = 'diterima', tanggal_sidang = ?, jam_sidang = ?, verified_at = NOW(), verified_by = ?
        WHERE id = ?
      `, [tanggalSidang, jamSidang, req.user.id, id]);
    } else {
      return res.status(400).json({ message: 'Status verifikasi tidak valid' });
    }

    res.json({
      message: `Kasus berhasil diverifikasi (${status})`,
      kasus_id: id,
      status
    });
  } catch (err) {
    console.error('Error verifyKasus:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};


/**
 * Get semua kasus (lengkap dengan relasi)
 */
const getAllKasus = async (req, res) => {
  try {
    let query = '';
    let params = [];

    // Hak akses berdasarkan role
    if (req.user.role === 'superadmin') {
      query = 'SELECT * FROM kasus';
    } else if (req.user.role === 'admin') {
      query = "SELECT * FROM kasus WHERE NOT (status = 'draf' AND created_by != ?)";
      params = [req.user.id];
    } else {
      query = 'SELECT * FROM kasus WHERE created_by = ?';
      params = [req.user.id];
    }

    const [kasusList] = await db.query(query, params);

    // Loop setiap kasus dan ambil relasinya
    for (const k of kasusList) {
      const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [k.id]);
      const [pelakuUsaha] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [k.id]);
      const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [k.id]);
      const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [k.id]);

      // Langsung masukkan relasi utama ke objek hasil
      k.data_diri = dataDiri[0] || null;
      k.pelaku_usaha = pelakuUsaha[0] || null;
      k.pengaduan = pengaduan[0] || null;
      k.kronologis = kronologis[0] || null;
    }

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
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const k = rowsKasus[0];

    // Hanya pembuat kasus yang boleh melihat, kecuali admin/superadmin
    if (req.user.role === 'user' && k.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat kasus orang lain' });

    const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [id]);
    const [pelakuUsaha] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [id]);
    const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [id]);
    const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [id]);

    res.json({
      ...k,
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

const updateSidang = async (req, res) => {
  const { id } = req.params;
  const { tuntas } = req.body; // boolean, apakah sidang tuntas atau tidak

  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // cek hak akses admin/superadmin
    if (!['admin', 'superadmin'].includes(req.user.role))
      return res.status(403).json({ message: 'Hanya admin/superadmin yang bisa update sidang' });

    let sidangKe = kasus.sidang_ke || 0;

    if (tuntas) {
      // sidang tuntas, status selesai
      await db.query(
        'UPDATE kasus SET status = ?, sidang_selesai = ?, sidang_ke = ? WHERE id = ?',
        ['selesai', true, sidangKe + 1, id]
      );

      return res.json({ message: 'Kasus selesai', sidang_ke: sidangKe + 1, status: 'selesai' });
    } else {
      // sidang belum tuntas, naikkan sidang_ke
      if (sidangKe >= 3) {
        // sudah sidang 3x, tetap dianggap selesai
        await db.query(
          'UPDATE kasus SET status = ?, sidang_selesai = ?, sidang_ke = ? WHERE id = ?',
          ['selesai', true, sidangKe, id]
        );
        return res.json({ message: 'Kasus selesai setelah sidang 3x', sidang_ke: sidangKe, status: 'selesai' });
      } else {
        // sidang berikutnya
        await db.query(
          'UPDATE kasus SET sidang_ke = ? WHERE id = ?',
          [sidangKe + 1, id]
        );
        return res.json({ message: `Sidang ke-${sidangKe + 1} selesai, kasus belum tuntas`, sidang_ke: sidangKe + 1, status: kasus.status });
      }
    }
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
  updateSidang,
};
