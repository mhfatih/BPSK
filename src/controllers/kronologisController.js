const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * GET kronologis
 */
const getKronologis = async (req, res) => {
  const { id } = req.params;
  try {
    const [rowsKasus] = await db.query(
      `SELECT kronologis, jenis_tuntutan, created_by
      FROM kasus
      WHERE id = ?`,
      [id]
    );

    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus = rowsKasus[0];

    if (req.user.role === 'user' && kasus.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat data orang lain' });

    res.json(kasus);
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
    // 🔍 Cek apakah kasus ada
    const [rowsKasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rowsKasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasusData = rowsKasus[0];

    // 🚫 Hanya pembuat kasus yang bisa update
    if (kasusData.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
    }

    // ✅ Validasi input
    if (!kronologis || !jenis_tuntutan) {
      return res.status(400).json({ message: 'Kronologis dan jenis tuntutan wajib diisi' });
    }

    // 🔁 Update langsung di tabel kasus
    await db.query(
      'UPDATE kasus SET kronologis = ?, jenis_tuntutan = ? WHERE id = ?',
      [kronologis, jenis_tuntutan, id]
    );

    res.json({ message: 'Kronologis berhasil disimpan', kasus_id: id });
  } catch (err) {
    console.error('Error updateKronologis:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {
  getKronologis,
  updateKronologis
};
