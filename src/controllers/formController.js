const { v4: uuidv4 } = require('uuid');

// Simulasi database sementara (pakai array)
let forms = [];

/**
 * Tahap 1: Data Diri
 */
const step1DataDiri = (req, res) => {
  const { namaLengkap, email, alamat, noHp } = req.body;

  if (!namaLengkap || !email || !alamat || !noHp) {
    return res.status(400).json({ message: 'Semua field data diri wajib diisi' });
  }

  const formId = uuidv4(); // generate id unik
  const newForm = {
    id: formId,
    dataDiri: { namaLengkap, email, alamat, noHp },
    dataPelakuUsaha: null,
    pengaduan: null,
    kronologis: null,
  };

  forms.push(newForm);

  res.status(201).json({ message: 'Data diri berhasil disimpan', formId });
};

/**
 * Tahap 2: Data Pelaku Usaha
 */
const step2PelakuUsaha = (req, res) => {
  const { id } = req.params;
  const { namaUsaha, alamatUsaha, jenisUsaha } = req.body;

  const form = forms.find(f => f.id === id);
  if (!form) {
    return res.status(404).json({ message: 'Form tidak ditemukan' });
  }

  form.dataPelakuUsaha = { namaUsaha, alamatUsaha, jenisUsaha };
  res.json({ message: 'Data pelaku usaha berhasil disimpan', id });
};

/**
 * Tahap 3: Tentang Pengaduan
 */
const step3Pengaduan = (req, res) => {
  const { id } = req.params;
  const { judulPengaduan, deskripsiPengaduan } = req.body;

  const form = forms.find(f => f.id === id);
  if (!form) {
    return res.status(404).json({ message: 'Form tidak ditemukan' });
  }

  form.pengaduan = { judulPengaduan, deskripsiPengaduan };
  res.json({ message: 'Data pengaduan berhasil disimpan', id });
};

/**
 * Tahap 4: Kronologis
 */
const step4Kronologis = (req, res) => {
  const { id } = req.params;
  const { kronologis } = req.body;

  const form = forms.find(f => f.id === id);
  if (!form) {
    return res.status(404).json({ message: 'Form tidak ditemukan' });
  }

  form.kronologis = kronologis;
  res.json({ message: 'Kronologis berhasil disimpan', id });
};

/**
 * Lihat semua form
 */
const getAllForms = (req, res) => {
  res.json(forms);
};

/**
 * Lihat form berdasarkan id
 */
const getFormById = (req, res) => {
  const { id } = req.params;
  const form = forms.find(f => f.id === id);

  if (!form) {
    return res.status(404).json({ message: 'Form tidak ditemukan' });
  }

  res.json(form);
};

module.exports = {
  step1DataDiri,
  step2PelakuUsaha,
  step3Pengaduan,
  step4Kronologis,
  getAllForms,
  getFormById,
};
