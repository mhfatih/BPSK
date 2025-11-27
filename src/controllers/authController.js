const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../db');
const { sendEmail } = require('../utils/mailer');
const SECRET_KEY = 'secret123';
const saltRounds = 10;

// REGISTER
const register = async (req, res) => {
  const { email, nama, password, confirm_password } = req.body;

  if (!email || !nama || !password || !confirm_password)
    return res.status(400).json({ message: 'Semua field wajib diisi' });

  if (password !== confirm_password)
    return res.status(400).json({ message: 'Password dan konfirmasi tidak sama' });

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    let userId;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (existing.length > 0) {
      const user = existing[0];

      if (user.is_verified === 1) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      userId = user.id;

      await db.query(`
        UPDATE users
        SET password = ?, is_verified = 0
        WHERE id = ?
      `, [hashedPassword, userId]);

      await db.query(`
        UPDATE profiles SET nama = ?
        WHERE user_id = ?
      `, [nama, userId]);

    } else {
      userId = uuidv4();

      await db.query(`
        INSERT INTO users (id, email, password, role, is_verified)
        VALUES (?, ?, ?, 'user', 0)
      `, [userId, email, hashedPassword]);

      await db.query(`
        INSERT INTO profiles (user_id, nama)
        VALUES (?, ?)
      `, [userId, nama]);
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpToken = jwt.sign(
      { user_id: userId, email, otp },
      SECRET_KEY,
      { expiresIn: '5m' }
    );

    await sendEmail(
      email,
      "Kode OTP Verifikasi Akun",
      `
        <h3>Verifikasi Email</h3>
        <p>Kode OTP kamu adalah:</p>
        <h2 style="letter-spacing: 3px;">${otp}</h2>
        <p>Kode ini berlaku selama <b>5 menit</b>.</p>
      `
    );

    res.cookie('otp_token', otpToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000
    });

    res.status(201).json({
      message:
        existing.length > 0
          ? "Akun belum terverifikasi. OTP baru dikirim ulang."
          : "Registrasi berhasil. Silakan cek email untuk OTP.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email dan password wajib diisi' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0)
      return res.status(401).json({ message: 'Email atau password salah' });

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Email atau password salah' });

    if (user.is_verified === 0) {
      return res.status(403).json({
        message: 'Akun belum diverifikasi. Silakan cek email untuk verifikasi.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, wilayah: user.wilayah },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 });
    res.json({
      message: `Login berhasil, selamat datang!`,
      token,
      id: user.id,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout berhasil' });
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const otp_token = req.cookies.otp_token;

  if (!otp_token)
    return res.status(400).json({ message: "OTP token tidak ditemukan" });

  try {
    const decoded = jwt.verify(otp_token, SECRET_KEY);

    if (decoded.otp !== otp)
      return res.status(400).json({ message: "OTP salah" });

    await db.query(`UPDATE users SET is_verified = 1 WHERE id = ?`, [
      decoded.user_id
    ]);

    res.clearCookie('otp_token');
    res.json({ message: "OTP berhasil diverifikasi" });

  } catch (err) {
    return res.status(400).json({ message: "OTP kadaluarsa atau token tidak valid" });
  }
};

// RESEND OTP
const resendOTP = async (req, res) => {
  const otpToken = req.cookies.otp_token;

  if (!otpToken)
    return res.status(400).json({ message: "OTP token tidak ditemukan" });

  try {
    const decoded = jwt.verify(otpToken, SECRET_KEY);

    const { user_id, email } = decoded;

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOtpToken = jwt.sign(
      { user_id, email, otp: newOtp },
      SECRET_KEY,
      { expiresIn: "5m" }
    );

    await sendEmail(
      email,
      "Kode OTP Verifikasi Akun",
      `
        <h3>Verifikasi Email</h3>
        <p>Kode OTP kamu adalah:</p>
        <h2>${newOtp}</h2>
        <p>Kode ini berlaku 5 menit.</p>
      `
    );

    res.cookie("otp_token", newOtpToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000
    });

    res.json({ message: "OTP baru telah dikirim" });

  } catch (err) {
    res.status(400).json({ message: "OTP tidak valid atau kadaluarsa" });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { old_password, new_password, confirm_password } = req.body;

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'User tidak ditemukan' });

    const user = rows[0];

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Password lama salah' });

    if (new_password !== confirm_password)
      return res.status(400).json({ message: 'Password baru dan konfirmasi tidak sama' });

    const hashedNew = await bcrypt.hash(new_password, saltRounds);

    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNew, userId]);

    res.json({ message: 'Password berhasil diubah' });

  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email wajib diisi" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    const user = rows[0];

    const resetToken = jwt.sign(
      { user_id: user.id, email },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Reset Password BPSK",
      `
        <h3>Reset Password</h3>
        <p>Klik link berikut untuk reset password kamu:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Link berlaku 15 menit.</p>
      `
    );

    res.json({ message: "Link reset password telah dikirim ke email" });

  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirm_password } = req.body;

  if (!password || !confirm_password)
    return res.status(400).json({ message: "Password wajib diisi" });

  if (password !== confirm_password)
    return res.status(400).json({ message: "Password tidak sama" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.user_id;

    const hashed = await bcrypt.hash(password, saltRounds);

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, userId]
    );

    res.json({ message: "Password berhasil direset" });

  } catch (err) {
    return res.status(400).json({ message: "Token tidak valid atau kadaluarsa" });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
  changePassword,
  forgotPassword,
  resetPassword
};
