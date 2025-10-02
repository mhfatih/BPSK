const { v4: uuidv4 } = require('uuid');
const { users, kasus } = require('../db');

/**
 * Buat kasus kosong
 */
const createKasus = (req, res) => {
  const kasusId = uuidv4();
  const newKasus = {
    id: kasusId,
    createdBy: req.user.id,
    dataDiri: null,
    dataPelakuUsaha: null,
    pengaduan: null,
    kronologis: null,
    status: 'draf', // default status
    createdAt: new Date().toISOString(), // waktu dibuat
  };

  kasus.push(newKasus);
  res.status(201).json({ message: 'Kasus berhasil dibuat', kasusId });
};

/**
 * Update data diri
 */
const updateDataDiri = (req, res) => {
  const { id } = req.params;
  const { namaLengkap, tanggalLahir, jenisKelamin, kota, alamat, email, noHp, buktiDiri, useProfile } = req.body;
  const user = users.find(u => u.email === req.user.email);

  const k = kasus.find(f => f.id === id);
  if (!k) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

  // hanya pembuat yang bisa update
  if (k.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
  }

  if (useProfile) {
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    k.dataDiri = {
      namaLengkap: user.namaLengkap,
      tanggalLahir: user.profile.tanggalLahir || null,
      jenisKelamin: user.profile.jenisKelamin || null,
      kota: user.profile.kota || null,
      alamat: user.profile.alamat,
      email: user.email,
      noHp: user.profile.noHp,
      buktiDiri: user.profile.identitas || null, // KTP/SIM
    };
    return res.json({ message: 'Data diri berhasil diisi dari profile', id });
  }

  // Validasi input manual
  if (!namaLengkap || !tanggalLahir || !jenisKelamin || !kota || !alamat || !email || !noHp || !buktiDiri) {
    return res.status(400).json({ message: 'Semua field data diri wajib diisi' });
  }

  k.dataDiri = { namaLengkap, tanggalLahir, jenisKelamin, kota, alamat, email, noHp, buktiDiri };
  res.json({ message: 'Data diri berhasil diisi manual', id });
};

/**
 * Update data pelaku usaha
 */
const updatePelakuUsaha = (req, res) => {
  const { id } = req.params;
  const { namaPemilik, perusahaan, kota, alamat, kodePos, noHp, faksimile } = req.body;

  const k = kasus.find(f => f.id === id);
  if (!k) return res.status(404).json({ message: 'Kasus tidak ditemukan' });
  if (k.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
  }

  // Validasi wajib isi
  if (!namaPemilik || !perusahaan || !kota || !alamat || !kodePos || !noHp) {
    return res.status(400).json({ message: 'Semua field pelaku usaha wajib diisi (kecuali faksimile opsional)' });
  }

  k.dataPelakuUsaha = {
    namaPemilik,
    perusahaan,
    kota,
    alamat,
    kodePos,
    noHp,
    faksimile: faksimile || null
  };

  res.json({ message: 'Data pelaku usaha berhasil disimpan', id });
};

/**
 * Update tentang pengaduan
 */
const updateTentangPengaduan = (req, res) => {
  const { id } = req.params;
  const { jenisPengaduan, tanggalKejadian, waktuKejadian, lokasi, kerugian, bukti } = req.body;

  const k = kasus.find(f => f.id === id);
  if (!k) return res.status(404).json({ message: 'Kasus tidak ditemukan' });
  if (k.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
  }

  // Validasi input wajib
  if (!jenisPengaduan || !tanggalKejadian || !waktuKejadian || !lokasi || !kerugian || !bukti) {
    return res.status(400).json({ message: 'Semua field pengaduan wajib diisi' });
  }

  if (!bukti.buktiPembelian || !bukti.buktiSaksi || !bukti.barangBukti) {
    return res.status(400).json({ message: 'Semua bukti (pembelian, saksi, barang) wajib diisi' });
  }

  k.pengaduan = {
    jenisPengaduan,
    tanggalKejadian,
    waktuKejadian,
    lokasi,
    kerugian,
    bukti: {
      buktiPembelian: bukti.buktiPembelian,
      buktiSaksi: bukti.buktiSaksi,
      barangBukti: bukti.barangBukti
    }
  };

  res.json({ message: 'Data pengaduan berhasil disimpan', id });
};

/**
 * Update kronologis
 */
const updateKronologis = (req, res) => {
  const { id } = req.params;
  const { kronologis, jenisTuntutan } = req.body;

  const k = kasus.find(f => f.id === id);
  if (!k) return res.status(404).json({ message: 'Kasus tidak ditemukan' });
  if (k.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Tidak boleh mengedit kasus orang lain' });
  }

  // Validasi input
  if (!kronologis || !jenisTuntutan) {
    return res.status(400).json({ message: 'Kronologis dan jenis tuntutan wajib diisi' });
  }

  k.kronologis = {
    kronologis,
    jenisTuntutan
  };

  res.json({ message: 'Kronologis berhasil disimpan', id });
};

/**
 * Submit pengaduan
 */
const submitKasus = (req, res) => {
  const { id } = req.params;
  const { konfirmasi } = req.body; // checkbox konfirmasi

  const k = kasus.find(f => f.id === id);
  if (!k) return res.status(404).json({ message: 'Kasus tidak ditemukan' });
  if (k.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Tidak boleh submit kasus orang lain' });
  }

  // cek kelengkapan data
  if (!k.dataDiri || !k.dataPelakuUsaha || !k.pengaduan || !k.kronologis) {
    return res.status(400).json({ message: 'Semua data wajib dilengkapi sebelum submit' });
  }

  // cek konfirmasi
  if (!konfirmasi) {
    return res.status(400).json({ message: 'Anda harus mencentang bahwa berkas yang diberikan adalah benar' });
  }

  k.status = 'menunggu verifikasi';
  k.submittedAt = new Date().toISOString();

  res.json({ 
    message: 'Kasus berhasil dikirim, menunggu verifikasi', 
    kasus: k 
  });
};

/**
 * Verifikasi oleh admin / superadmin
 */
const verifyKasus = (req, res) => {
  const { id } = req.params;
  const { status, alasanPenolakan, tanggalSidang, jamSidang } = req.body;

  const k = kasus.find(f => f.id === id);
  if (!k) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Hanya admin atau superadmin yang bisa verifikasi' });
  }

  if (k.status !== 'menunggu verifikasi') {
    return res.status(400).json({ message: 'Kasus belum disubmit atau sudah diverifikasi' });
  }

  if (status !== 'diterima' && status !== 'ditolak') {
    return res.status(400).json({ message: 'Status verifikasi tidak valid' });
  }

  if (status === 'ditolak') {
    if (!alasanPenolakan) {
      return res.status(400).json({ message: 'Alasan penolakan wajib diisi jika kasus ditolak' });
    }
    k.status = 'ditolak';
    k.alasanPenolakan = alasanPenolakan;
  }

  if (status === 'diterima') {
    if (!tanggalSidang || !jamSidang) {
      return res.status(400).json({ message: 'Tanggal dan jam sidang wajib diisi jika kasus diterima' });
    }
    k.status = 'diterima';
    k.tanggalSidang = tanggalSidang;
    k.jamSidang = jamSidang;
  }

  k.verifiedAt = new Date().toISOString();
  k.verifiedBy = {
    id: req.user.id,
    nama: req.user.namaLengkap || req.user.email, // fallback ke email kalau nama kosong
  };

  res.json({ 
    message: `Kasus berhasil diverifikasi (${status})`, 
    kasus: k 
  });
};

/**
 * Lihat semua kasus
 */
const getAllKasus = (req, res) => {
  if (req.user.role === 'superadmin') {
    return res.json(kasus);
  }

  if (req.user.role === 'admin') {
    // admin lihat semua kecuali draf milik user
    const filtered = kasus.filter(k => !(k.status === 'draf' && k.createdBy !== req.user.id));
    return res.json(filtered);
  }

  // user biasa → hanya lihat miliknya
  const userKasus = kasus.filter(k => k.createdBy === req.user.id);
  res.json(userKasus);
};

/**
 * Lihat kasus berdasarkan id
 */
const getKasusById = (req, res) => {
  const { id } = req.params;
  const k = kasus.find(f => f.id === id);
  if (!k) return res.status(404).json({ message: 'Kasus tidak ditemukan' });

  // hanya pembuat, admin, superadmin yang boleh lihat
  if (req.user.role === 'user' && k.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Tidak boleh melihat kasus orang lain' });
  }
  if (req.user.role === 'admin' && k.status === 'draf' && k.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Admin tidak boleh melihat draf orang lain' });
  }

  res.json(k);
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
