const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../db');

/**
 * GET tentang pengaduan
 */
const getTentangPengaduan = async (req, res) => {
  const { id } = req.params;
  try {
    // Ambil data kasus langsung
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // Hanya pembuat kasus yang bisa melihat jika role = user
    if (req.user.role === 'user' && kasus.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat data orang lain' });

    // Ambil data pengaduan langsung dari tabel kasus
    const pengaduan = {
      jenis_pengaduan: kasus.jenis_pengaduan,
      tanggal_kejadian: kasus.tanggal_kejadian,
      waktu_kejadian: kasus.waktu_kejadian,
      lokasi_kejadian: kasus.lokasi_kejadian,
      jenis_kerugian: kasus.jenis_kerugian,
      keterangan_kerugian: kasus.keterangan_kerugian,
      bukti_pembelian: kasus.bukti_pembelian,
      bukti_saksi: kasus.bukti_saksi,
      hubungan_saksi: kasus.hubungan_saksi,
      barang_bukti: kasus.barang_bukti,
      foto_bukti: kasus.foto_bukti,
    };

    res.json(pengaduan);
  } catch (err) {
    console.error('Error getTentangPengaduan:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Update tentang pengaduan
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
    // 🔍 Cek apakah kasus ada
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    // 🚫 Hanya pembuat kasus yang bisa update
    if (kasus.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });

    // ✅ Validasi field wajib
    if (!jenis_pengaduan || !tanggal_kejadian || !waktu_kejadian || !lokasi_kejadian)
      return res.status(400).json({ message: 'Field wajib tidak lengkap' });

    // 🧾 Siapkan data untuk update
    const updateData = {
      jenis_pengaduan,
      tanggal_kejadian,
      waktu_kejadian,
      lokasi_kejadian,
      jenis_kerugian: jenis_kerugian || null,
      keterangan_kerugian: keterangan_kerugian || null,
      bukti_pembelian: bukti_pembelian || null,
      bukti_saksi: bukti_saksi || null,
      hubungan_saksi: bukti_saksi === 'ada' ? hubungan_saksi || null : null,
      barang_bukti: barang_bukti || null,
    };

    // 📸 Tangani upload foto (jika ada)
    if (req.file) {
      // Cek kalau sebelumnya sudah ada foto
      if (kasus.foto_bukti) {
        const oldPath = path.join(__dirname, '..', kasus.foto_bukti);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
            console.log('🧹 Foto bukti lama dihapus:', oldPath);
          } catch (err) {
            console.error('Gagal hapus foto lama:', err);
          }
        }
      }

      // Simpan path baru ke database
      updateData.foto_bukti = req.file.path
        .replace(/\\/g, '/')
        .replace(/^.*uploads/, '/uploads');
    }

    // 💾 Update langsung di tabel kasus
    await db.query('UPDATE kasus SET ? WHERE id = ?', [updateData, id]);

    res.json({
      message: 'Data pengaduan berhasil diperbarui',
      kasus_id: id,
      data: updateData,
    });
  } catch (err) {
    console.error('Error updateTentangPengaduan:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  getTentangPengaduan,
  updateTentangPengaduan
};
