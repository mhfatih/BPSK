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
 * Update tentang pengaduan + bukti
 */
const updateTentangPengaduan = async (req, res) => {
  const { id } = req.params;
  const {
    jenis_pengaduan,
    tanggal_kejadian,
    waktu_kejadian,
    lokasi_kejadian,
    kerugian_material,
    keterangan_material,
    kerugian_fisik,
    keterangan_fisik,
    // Bukti Pembelian
    jenis_bukti_pembelian,
    // Barang Bukti
    status_barang_bukti,
    keterangan_barang_bukti,
    // Bukti Saksi
    status_saksi,
    hubungan_dengan_saksi,
  } = req.body;

  try {
    // 🔍 Cek apakah kasus ada
    const [rows_kasus] = await db.query('SELECT * FROM kasus WHERE id = ?', [id]);
    if (rows_kasus.length === 0)
      return res.status(404).json({ message: 'Kasus tidak ditemukan' });

    const kasus_data = rows_kasus[0];
    if (kasus_data.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });

    // ✅ Validasi pengaduan utama
    if (!jenis_pengaduan || !tanggal_kejadian || !waktu_kejadian || !lokasi_kejadian)
      return res.status(400).json({ message: 'Field wajib tidak lengkap' });

    // 💡 Konversi boolean dari string
    const material = kerugian_material === 'true' || kerugian_material === true;
    const fisik = kerugian_fisik === 'true' || kerugian_fisik === true;

    const pengaduanData = {
      jenis_pengaduan,
      tanggal_kejadian,
      waktu_kejadian,
      lokasi_kejadian,
      kerugian_material: material,
      keterangan_material: material ? keterangan_material || null : null,
      kerugian_fisik: fisik,
      keterangan_fisik: fisik ? keterangan_fisik || null : null,
    };

    // 💾 Update / Insert kasus_pengaduan
    const [existing] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [id]);
    if (existing.length > 0)
      await db.query('UPDATE kasus_pengaduan SET ? WHERE kasus_id = ?', [pengaduanData, id]);
    else
      await db.query('INSERT INTO kasus_pengaduan SET ?, kasus_id = ?', [pengaduanData, id]);

    // 🧾 Minimal bukti pembelian & barang bukti wajib diisi
    if (!jenis_bukti_pembelian || !status_barang_bukti)
      return res.status(400).json({ message: 'Bukti pembelian dan barang bukti wajib diisi' });

    // 💾 Simpan / Update Bukti Pembelian
    const [existingPembelian] = await db.query(
      'SELECT id FROM kasus_bukti_pembelian WHERE kasus_id = ?',
      [id]
    );

    let pembelian_id;
    if (existingPembelian.length > 0) {
      pembelian_id = existingPembelian[0].id;
      await db.query(
        'UPDATE kasus_bukti_pembelian SET jenis_bukti = ? WHERE kasus_id = ?',
        [jenis_bukti_pembelian, id]
      );
    } else {
      pembelian_id = uuidv4();
      await db.query(
        'INSERT INTO kasus_bukti_pembelian (id, kasus_id, jenis_bukti) VALUES (?, ?, ?)',
        [pembelian_id, id, jenis_bukti_pembelian]
      );
    }

    // 💾 Simpan / Update Barang Bukti
    const [existingBarang] = await db.query(
      'SELECT id FROM kasus_barang_bukti WHERE kasus_id = ?',
      [id]
    );

    let barang_id;
    if (existingBarang.length > 0) {
      barang_id = existingBarang[0].id;
      await db.query(
        'UPDATE kasus_barang_bukti SET status = ?, keterangan = ? WHERE kasus_id = ?',
        [status_barang_bukti, keterangan_barang_bukti || null, id]
      );
    } else {
      barang_id = uuidv4();
      await db.query(
        'INSERT INTO kasus_barang_bukti (id, kasus_id, status, keterangan) VALUES (?, ?, ?, ?)',
        [barang_id, id, status_barang_bukti, keterangan_barang_bukti || null]
      );
    }

    // 💾 Simpan / Update Bukti Saksi (opsional)
    let saksi_id = null;
    if (status_saksi) {
      const [existingSaksi] = await db.query(
        'SELECT id FROM kasus_bukti_saksi WHERE kasus_id = ?',
        [id]
      );

      if (existingSaksi.length > 0) {
        saksi_id = existingSaksi[0].id;
        await db.query(
          'UPDATE kasus_bukti_saksi SET status = ?, hubungan_dengan_saksi = ? WHERE kasus_id = ?',
          [status_saksi, status_saksi === 'ada' ? hubungan_dengan_saksi || null : null, id]
        );
      } else {
        saksi_id = uuidv4();
        await db.query(
          'INSERT INTO kasus_bukti_saksi (id, kasus_id, status, hubungan_dengan_saksi) VALUES (?, ?, ?, ?)',
          [saksi_id, id, status_saksi, status_saksi === 'ada' ? hubungan_dengan_saksi || null : null]
        );
      }
    }

    // 📸 Simpan / Update foto bukti
    if (req.files) {
      const allFiles = [];

      // Bukti Pembelian
      if (req.files.foto_bukti_pembelian) {
        req.files.foto_bukti_pembelian.forEach((file, index) => {
          allFiles.push({
            bukti_id: pembelian_id,
            jenis_bukti: 'bukti pembelian',
            nomor_bukti: index + 1, // mulai dari 1
            path: file.path.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads'),
          });
        });
      }

      // Barang Bukti
      if (req.files.foto_barang_bukti) {
        req.files.foto_barang_bukti.forEach((file, index) => {
          allFiles.push({
            bukti_id: barang_id,
            jenis_bukti: 'barang bukti',
            nomor_bukti: index + 1, // mulai dari 1
            path: file.path.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads'),
          });
        });
      }

      // 🧩 Simpan atau update ke DB
      for (const f of allFiles) {
        const [existingFoto] = await db.query(
          `SELECT id, foto_path FROM kasus_bukti_foto WHERE bukti_id = ? AND nomor_bukti = ?`,
          [f.bukti_id, f.nomor_bukti]
        );

        if (existingFoto.length > 0) {
          // 🗑️ Hapus file lama di storage (kalau ada)
          const oldPath = path.join(__dirname, '..', existingFoto[0].foto_path);
          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (err) {
              console.error(`Gagal hapus file lama: ${oldPath}`, err);
            }
          }

          // 🔁 Update path baru di database
          await db.query(
            `UPDATE kasus_bukti_foto 
       SET foto_path = ?, uploaded_at = NOW() 
       WHERE bukti_id = ? AND nomor_bukti = ?`,
            [f.path, f.bukti_id, f.nomor_bukti]
          );
        } else {
          // ➕ Insert baru
          const foto_id = uuidv4();
          await db.query(
            `INSERT INTO kasus_bukti_foto (id, bukti_id, jenis_bukti, nomor_bukti, foto_path, uploaded_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
            [foto_id, f.bukti_id, f.jenis_bukti, f.nomor_bukti, f.path]
          );
        }
      }

      /* 🧹 Tambahan: hapus foto lama yang tidak dikirim lagi */

      // 1️⃣ Ambil semua nomor_bukti yang baru diupload
      const newNomorsByBukti = {};
      for (const f of allFiles) {
        if (!newNomorsByBukti[f.bukti_id]) newNomorsByBukti[f.bukti_id] = [];
        newNomorsByBukti[f.bukti_id].push(f.nomor_bukti);
      }

      // 2️⃣ Untuk setiap bukti_id, cari foto lama yang tidak ada di upload baru
      for (const [bukti_id, newNomors] of Object.entries(newNomorsByBukti)) {
        const [oldFotos] = await db.query(
          `SELECT id, foto_path, nomor_bukti FROM kasus_bukti_foto WHERE bukti_id = ?`,
          [bukti_id]
        );

        for (const old of oldFotos) {
          if (!newNomors.includes(old.nomor_bukti)) {
            // 🗑️ Hapus file di storage
            const oldPath = path.join(__dirname, '..', old.foto_path);
            if (fs.existsSync(oldPath)) {
              try {
                fs.unlinkSync(oldPath);
                console.log(`🧹 Hapus foto lama: ${oldPath}`);
              } catch (err) {
                console.error(`Gagal hapus file lama: ${oldPath}`, err);
              }
            }

            // 🗑️ Hapus record dari DB
            await db.query(`DELETE FROM kasus_bukti_foto WHERE id = ?`, [old.id]);
          }
        }
      }
    }

    // ✅ Response
    res.json({
      message: 'Data pengaduan dan seluruh bukti berhasil disimpan',
      kasus_id: id,
      pengaduan: pengaduanData,
      bukti: {
        bukti_pembelian: { jenis: jenis_bukti_pembelian },
        bukti_saksi: status_saksi
          ? {
            status: status_saksi,
            hubungan: status_saksi === 'ada' ? hubungan_dengan_saksi || null : null,
          }
          : null,
        barang_bukti: {
          status: status_barang_bukti,
          keterangan: keterangan_barang_bukti || null,
        },
        foto_bukti: req.files
          ? Object.values(req.files).flat().map(file => ({
            nama_file: file.originalname,
            path: file.path.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads'),
          }))
          : [],
      },
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

    for (const k of kasusList) {
      const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [k.id]);
      const [pelakuUsaha] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [k.id]);
      const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [k.id]);
      const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [k.id]);

      // Ambil bukti-bukti terkait
      const [buktiPembelian] = await db.query('SELECT * FROM kasus_bukti_pembelian WHERE kasus_id = ?', [k.id]);
      const [barangBukti] = await db.query('SELECT * FROM kasus_barang_bukti WHERE kasus_id = ?', [k.id]);
      const [buktiSaksi] = await db.query('SELECT * FROM kasus_bukti_saksi WHERE kasus_id = ?', [k.id]);

      // Ambil semua foto
      const allBuktiIds = [
        ...(buktiPembelian.map(b => b.id)),
        ...(barangBukti.map(b => b.id)),
        ...(buktiSaksi.map(b => b.id))
      ];
      let fotoList = [];
      if (allBuktiIds.length > 0) {
        const [fotoRows] = await db.query(
          `SELECT * FROM kasus_bukti_foto WHERE bukti_id IN (?)`,
          [allBuktiIds]
        );
        fotoList = fotoRows;
      }

      k.data_diri = dataDiri[0] || null;
      k.pelaku_usaha = pelakuUsaha[0] || null;
      k.kronologis = kronologis[0] || null;
      k.pengaduan = pengaduan[0] || null;
      k.bukti = {
        pembelian: buktiPembelian,
        barang_bukti: barangBukti,
        saksi: buktiSaksi,
        foto: fotoList
      };
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
    if (req.user.role === 'user' && k.created_by !== req.user.id)
      return res.status(403).json({ message: 'Tidak boleh melihat kasus orang lain' });

    const [dataDiri] = await db.query('SELECT * FROM kasus_data_diri WHERE kasus_id = ?', [id]);
    const [pelakuUsaha] = await db.query('SELECT * FROM kasus_pelaku_usaha WHERE kasus_id = ?', [id]);
    const [pengaduan] = await db.query('SELECT * FROM kasus_pengaduan WHERE kasus_id = ?', [id]);
    const [kronologis] = await db.query('SELECT * FROM kasus_kronologis WHERE kasus_id = ?', [id]);
    const [buktiPembelian] = await db.query('SELECT * FROM kasus_bukti_pembelian WHERE kasus_id = ?', [id]);
    const [barangBukti] = await db.query('SELECT * FROM kasus_barang_bukti WHERE kasus_id = ?', [id]);
    const [buktiSaksi] = await db.query('SELECT * FROM kasus_bukti_saksi WHERE kasus_id = ?', [id]);

    const allBuktiIds = [
      ...(buktiPembelian.map(b => b.id)),
      ...(barangBukti.map(b => b.id)),
      ...(buktiSaksi.map(b => b.id))
    ];
    let fotoList = [];
    if (allBuktiIds.length > 0) {
      const [fotoRows] = await db.query(
        `SELECT * FROM kasus_bukti_foto WHERE bukti_id IN (?)`,
        [allBuktiIds]
      );
      fotoList = fotoRows;
    }

    res.json({
      ...k,
      data_diri: dataDiri[0] || null,
      pelaku_usaha: pelakuUsaha[0] || null,
      pengaduan: pengaduan[0] || null,
      kronologis: kronologis[0] || null,
      bukti: {
        pembelian: buktiPembelian,
        barang_bukti: barangBukti,
        saksi: buktiSaksi,
        foto: fotoList
      }
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
