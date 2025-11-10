const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { uploader, deleteOldFile } = require('../utils/uploader');

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

const updateDataDiri = async (req, res) => {
  const { id } = req.params;
  const upload = uploader(`kasus/${id}`, 'foto_identitas', {
    maxSize: 3 * 1024 * 1024, // 3 MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  }).single('pengadu_foto_identitas');

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Ukuran file terlalu besar (maksimal 3MB)' });
      }
      if (err.message === 'Jenis file tidak diizinkan') {
        return res.status(400).json({ message: 'Jenis file tidak diizinkan (hanya JPG, PNG, PDF)' });
      }
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file' });
    }

    const {
      pengadu_nama,
      pengadu_umur,
      pengadu_jenis_kelamin,
      pengadu_kota,
      pengadu_alamat,
      pengadu_email,
      pengadu_no_hp,
      pengadu_kode_pos,
      pengadu_identitas,
    } = req.body;

    try {
      // 🔍 Cek apakah kasus ada
      const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
      if (rowsKasus.length === 0)
        return res.status(404).json({ message: 'Kasus tidak ditemukan' });

      const kasus = rowsKasus[0];

      // 🚫 Cegah edit milik orang lain
      if (kasus.created_by !== req.user.id)
        return res.status(403).json({ message: 'Tidak boleh mengedit data diri orang lain' });

      // 📦 Siapkan data update
      const updateData = {
        pengadu_nama: pengadu_nama || null,
        pengadu_umur: pengadu_umur || null,
        pengadu_jenis_kelamin: pengadu_jenis_kelamin || null,
        pengadu_kota: pengadu_kota || null,
        pengadu_alamat: pengadu_alamat || null,
        pengadu_email: pengadu_email || null,
        pengadu_no_hp: pengadu_no_hp || null,
        pengadu_kode_pos: pengadu_kode_pos || null,
        pengadu_identitas: pengadu_identitas || null,
      };

      // 🗺️ Tentukan wilayah berdasarkan kota
      const wkp1Cities = ['Kota Tangerang', 'Kota Tangerang Selatan', 'Kabupaten Tangerang'];
      if (pengadu_kota && wkp1Cities.includes(pengadu_kota)) {
        updateData.wilayah = 'WKP1';
      } else {
        updateData.wilayah = 'WKP2';
      }

      // 📸 Tangani upload foto identitas
      if (req.file) {
        deleteOldFile(kasus.pengadu_foto_identitas);
        updateData.pengadu_foto_identitas = req.file.path
          .replace(/\\/g, '/')
          .replace(/^.*uploads/, '/uploads');
      }

      await db.query('UPDATE kasus SET ? WHERE id = ?', [updateData, id]);

      res.json({
        message: 'Data diri berhasil diperbarui',
        kasus_id: id,
        data: updateData,
      });
    } catch (err) {
      console.error('Error updateDataDiri:', err);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  });
};

module.exports = {
  getDataDiri,
  updateDataDiri,
};
