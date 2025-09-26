// Simulasi database sementara
let users = [];

// =========================
// REGISTER
// =========================
const register = (req, res) => {
  const { email, namaLengkap, password, confirmPassword } = req.body;

  if (!email || !namaLengkap || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password dan konfirmasi password tidak sama' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }

  // Data user awal
  users.push({
    email,
    namaLengkap,
    password,
    profile: {
      tanggalLahir: null,
      jenisKelamin: null,
      alamat: null,
      kodePos: null,
      noHp: null,
      identitas: null, // KTP/SIM
    },
  });

  res.status(201).json({ message: 'Registrasi berhasil' });
};

// =========================
// LOGIN (email saja)
// =========================
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }

  res.json({ message: `Login berhasil, selamat datang ${user.namaLengkap}` });
};

// =========================
// GET PROFILE
// =========================
const getProfile = (req, res) => {
  const { email } = req.params;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  res.json({
    email: user.email,
    namaLengkap: user.namaLengkap,
    profile: user.profile,
  });
};

// =========================
// UPDATE PROFILE
// =========================
const updateProfile = (req, res) => {
  const { email } = req.params;
  const { tanggalLahir, jenisKelamin, alamat, kodePos, noHp, identitas } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User tidak ditemukan' });
  }

  user.profile = {
    tanggalLahir: tanggalLahir || user.profile.tanggalLahir,
    jenisKelamin: jenisKelamin || user.profile.jenisKelamin,
    alamat: alamat || user.profile.alamat,
    kodePos: kodePos || user.profile.kodePos,
    noHp: noHp || user.profile.noHp,
    identitas: identitas || user.profile.identitas,
  };

  res.json({ message: 'Profile berhasil diperbarui', profile: user.profile });
};

module.exports = { register, login, getProfile, updateProfile };
