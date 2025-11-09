const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../db');

/**
 * GET data diri (dari tabel kasus)
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

    const dataDiri = {
      nama: rowsKasus[0].pengadu_nama,
      umur: rowsKasus[0].pengadu_umur,
      jenis_kelamin: rowsKasus[0].pengadu_jenis_kelamin,
      kota: rowsKasus[0].pengadu_kota,
      alamat: rowsKasus[0].pengadu_alamat,
      email: rowsKasus[0].pengadu_email,
      no_hp: rowsKasus[0].pengadu_no_hp,
      kode_pos: rowsKasus[0].pengadu_kode_pos,
      identitas: rowsKasus[0].pengadu_identitas,
      foto_identitas: rowsKasus[0].pengadu_foto_identitas,
    };

    res.json(dataDiri);
  } catch (err) {
    console.error('Error getDataDiri:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * UPDATE data diri
 */
const updateDataDiri = async (req, res) => {
  const { id } = req.params;
  const {
    nama,
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
    if (kasus_data.created_by !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
    }

    // 🧩 Validasi input wajib
    if (
      !nama || !umur || !jenis_kelamin || !kota ||
      !alamat || !email || !no_hp || !kode_pos || !identitas
    ) {
      return res.status(400).json({ message: 'Semua field data diri wajib diisi' });
    }

    // 📂 Folder penyimpanan file
    const targetFolder = path.join(__dirname, '..', 'uploads', req.user.id, 'kasus', id);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

    let foto_identitas_path = kasus_data.pengadu_foto_identitas || null;

    // 📸 Simpan foto baru (kalau ada)
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const destFilename = `identitas${ext}`;
      const destPath = path.join(targetFolder, destFilename);
      fs.renameSync(req.file.path, destPath);
      foto_identitas_path = '/' + path.relative(path.join(__dirname, '..'), destPath).replace(/\\/g, '/');
    }

    // 💾 Update data ke tabel kasus
    await db.query(
      `UPDATE kasus SET
        pengadu_nama = ?,
        pengadu_umur = ?,
        pengadu_jenis_kelamin = ?,
        pengadu_kota = ?,
        pengadu_alamat = ?,
        pengadu_email = ?,
        pengadu_no_hp = ?,
        pengadu_kode_pos = ?,
        pengadu_identitas = ?,
        pengadu_foto_identitas = ?
      WHERE id = ?`,
      [
        nama,
        parseInt(umur, 10),
        jenis_kelamin,
        kota,
        alamat,
        email,
        no_hp,
        kode_pos,
        identitas,
        foto_identitas_path,
        id,
      ]
    );

    // 🧭 Tentukan wilayah berdasarkan kota
    let wilayah = null;
    const wkp1 = ['Kota Tangerang', 'Kota Tangerang Selatan', 'Kabupaten Tangerang'];
    wilayah = wkp1.includes(kota) ? 'WKP1' : 'WKP2';

    await db.query('UPDATE kasus SET wilayah = ? WHERE id = ?', [wilayah, id]);

    res.json({
      message: 'Data diri berhasil disimpan',
      kasus_id: id,
      wilayah,
      foto_identitas: foto_identitas_path,
    });
  } catch (err) {
    console.error('Error updateDataDiri:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  getDataDiri,
  updateDataDiri,
};
