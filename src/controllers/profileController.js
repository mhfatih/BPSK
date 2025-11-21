const path = require('path');
const db = require('../db');
const { uploader, deleteOldFile } = require('../utils/uploader');


// GET PROFILE (user login sendiri)
const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        u.id, u.email, u.role,
        p.nama, p.tanggal_lahir, p.jenis_kelamin,
        p.kota, p.alamat, p.kode_pos, p.no_hp,
        p.identitas, p.foto_identitas
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [userId]);

    if (rows.length === 0) return res.status(404).json({ message: 'Profil tidak ditemukan' });

    const user = rows[0];
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: {
        nama: user.nama,
        tanggal_lahir: user.tanggal_lahir,
        jenis_kelamin: user.jenis_kelamin,
        kota: user.kota,
        alamat: user.alamat,
        kode_pos: user.kode_pos,
        no_hp: user.no_hp,
        identitas: user.identitas,
        foto_identitas: user.foto_identitas
          ? `${req.protocol}://${req.get('host')}${user.foto_identitas}`
          : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 *  Update profil pengguna
 */
const updateProfile = async (req, res) => {
  const userId = req.user.id;

  // Konfigurasi upload foto
  const upload = uploader(`user/${userId}`, 'foto_identitas', {
    maxSize: 3 * 1024 * 1024, // 3 MB
    allowedTypes: ['image/jpeg', 'image/png'],
  }).single('foto_identitas');

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Ukuran file terlalu besar (maksimal 3MB)' });
      }
      if (err.message === 'Jenis file tidak diizinkan') {
        return res.status(400).json({ message: 'Jenis file tidak diizinkan (hanya JPG, PNG)' });
      }
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengunggah file' });
    }

    const {
      nama,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      kota,
      kode_pos,
      no_hp,
      identitas,
    } = req.body;

    try {
      // Cek apakah user punya data diri
      const [rows] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
      const oldData = rows[0];

      const updateData = {
        nama: nama || oldData?.nama || null,
        tanggal_lahir: tanggal_lahir || oldData?.tanggal_lahir || null,
        jenis_kelamin: jenis_kelamin || oldData?.jenis_kelamin || null,
        alamat: alamat || oldData?.alamat || null,
        kota: kota || oldData?.kota || null,
        kode_pos: kode_pos || oldData?.kode_pos || null,
        no_hp: no_hp || oldData?.no_hp || null,
        identitas: identitas || oldData?.identitas || null,
      };

      // Kalau ada file baru → hapus file lama + simpan path baru
      if (req.file) {
        if (oldData?.foto_identitas) {
          deleteOldFile(oldData.foto_identitas);
        }
        updateData.foto_identitas = req.file.path
          .replace(/\\/g, '/')
          .replace(/^.*uploads/, '/uploads');
      }

      if (rows.length > 0) {
        await db.query('UPDATE profiles SET ? WHERE user_id = ?', [updateData, userId]);
      } else {
        await db.query('INSERT INTO profiles SET ?', [{ user_id: userId, ...updateData }]);
      }

      res.json({
        message: 'Profil berhasil diperbarui',
        data: updateData,
      });
    } catch (err) {
      console.error('Error updateProfile:', err);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  });
};

module.exports = {
  getProfile,
  updateProfile
};
