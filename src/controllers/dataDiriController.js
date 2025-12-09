const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
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
      pengadu_nama: rowsKasus[0].pengadu_nama,
      pengadu_umur: rowsKasus[0].pengadu_umur,
      pengadu_jenis_kelamin: rowsKasus[0].pengadu_jenis_kelamin,
      pengadu_kota: rowsKasus[0].pengadu_kota,
      pengadu_alamat: rowsKasus[0].pengadu_alamat,
      pengadu_email: rowsKasus[0].pengadu_email,
      pengadu_no_hp: rowsKasus[0].pengadu_no_hp,
      pengadu_kode_pos: rowsKasus[0].pengadu_kode_pos,
      pengadu_identitas: rowsKasus[0].pengadu_identitas,
      pengadu_foto_identitas: rowsKasus[0].pengadu_foto_identitas,
      pengadu_file_pendukung: rowsKasus[0].pengadu_file_pendukung,
    };

    res.json(dataDiri);
  } catch (err) {
    console.error('Error getDataDiri:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

const updateDataDiri = async (req, res) => {
  const { id } = req.params;

  // === UPLOADER UNTUK 2 FILE SEKALIGUS ===
  const upload = uploader(`kasus/${id}`, '', {
    maxSize: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
  }).fields([
    { name: 'pengadu_foto_identitas', maxCount: 1 },
    { name: 'pengadu_file_pendukung', maxCount: 1 }
  ]);

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

    // ==== BODY ====
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
      // 🔍 Cek kasus ada
      const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
      if (rowsKasus.length === 0)
        return res.status(404).json({ message: 'Kasus tidak ditemukan' });

      const kasus = rowsKasus[0];

      // 🚫 Cegah edit milik orang lain
      if (kasus.created_by !== req.user.id)
        return res.status(403).json({ message: 'Tidak boleh mengedit data orang lain' });

      // === Data Update ===
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

      // Wilayah
      const wkp1Cities = ['Kota Tangerang', 'Kota Tangerang Selatan', 'Kabupaten Tangerang'];
      updateData.wilayah = pengadu_kota && wkp1Cities.includes(pengadu_kota) ? 'WKP1' : 'WKP2';

      // === FOTO IDENTITAS ===
      if (req.files['pengadu_foto_identitas']) {
        deleteOldFile(kasus.pengadu_foto_identitas);
        const file = req.files['pengadu_foto_identitas'][0];
        updateData.pengadu_foto_identitas = file.path
          .replace(/\\/g, '/')
          .replace(/^.*uploads/, '/uploads');
      }

      // === FILE PENDUKUNG (IMG/PDF) ===
      if (req.files['pengadu_file_pendukung']) {
        deleteOldFile(kasus.pengadu_file_pendukung);
        const filePendukung = req.files['pengadu_file_pendukung'][0];
        updateData.pengadu_file_pendukung = filePendukung.path
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
