const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../db');

/**
 * GET data diri
 */
const getDataDiri = async (req, res) => {
  const { id } = req.params;
  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    // hanya pembuat kasus yang boleh lihat, kecuali admin/superadmin
    if (req.user.role === 'user' && rowsKasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat data orang lain' });

    const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [id]);

    res.json(dataDiri[0] || {});
  } catch (err) {
    console.error('Error getDataDiri:', err);
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

    // 🧭 Tentukan wilayah berdasarkan kota
    let wilayah = null;
    const wkp1 = ['Kota Tangerang', 'Kota Tangerang Selatan', 'Kabupaten Tangerang'];
    if (wkp1.includes(kota)) {
      wilayah = 'WKP1';
    } else {
      wilayah = 'WKP2';
    }

    // 💾 Update kolom wilayah di tabel kasus
    await db.query('UPDATE kasus SET wilayah = ? WHERE id = ?', [wilayah, id]);

    console.log('Data yang disimpan:', data);
    console.log('Wilayah ditetapkan:', wilayah);

    res.json({
      message: 'Data diri berhasil disimpan',
      kasus_id: id,
      wilayah,
      foto_identitas: foto_identitas_path,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * GET pelaku usaha
 */
const getPelakuUsaha = async (req, res) => {
  const { id } = req.params;
  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    if (req.user.role === 'user' && rowsKasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat data orang lain' });

    const [pelaku] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [id]);

    res.json(pelaku[0] || {});
  } catch (err) {
    console.error('Error getPelakuUsaha:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update data pelaku usaha
 */
const updatePelakuUsaha = async (req, res) => {
  const { id } = req.params;
  const { nama_pemilik, perusahaan, kota, alamat, kode_pos, no_hp, email } = req.body;

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
      return res.status(400).json({ message: 'Semua field pelaku usaha wajib diisi' });
    }

    const data = {
      nama_pemilik,
      perusahaan,
      kota,
      alamat,
      kode_pos,
      no_hp,
      email
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
 * GET tentang pengaduan
 */
const getTentangPengaduan = async (req, res) => {
  const { id } = req.params;
  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    if (req.user.role === 'user' && rowsKasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat data orang lain' });

    const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [id]);

    res.json(pengaduan[0] || {});
  } catch (err) {
    console.error('Error getTentangPengaduan:', err);
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
 * GET kronologis
 */
const getKronologis = async (req, res) => {
  const { id } = req.params;
  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    if (req.user.role === 'user' && rowsKasus[0].created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat data orang lain' });

    const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [id]);

    res.json(kronologis[0] || {});
  } catch (err) {
    console.error('Error getKronologis:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update kronologis
 */
const updateKronologis = async (req, res) => {
  const { id } = req.params;
  const { kronologis, jenis_tuntutan } = req.body;

  try {
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasusData = rowsKasus[0];
    if (kasusData.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
    }

    if (!kronologis || !jenis_tuntutan) {
      return res.status(400).json({ message: 'Kronologis dan jenis tuntutan wajib diisi' });
    }

    const data = { kronologis, jenis_tuntutan: jenis_tuntutan };

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

module.exports = {
  getDataDiri,
  updateDataDiri,
  getPelakuUsaha,
  updatePelakuUsaha,
  getTentangPengaduan,
  updateTentangPengaduan,
  getKronologis,
  updateKronologis,
};
