require('dotenv').config();
const nodemailer = require('nodemailer');

// 🔧 Setup transporter (sekali aja, pakai setting yang sama seperti testmail)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true karena pakai port 465 (SSL)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📤 Fungsi helper untuk kirim email
async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"Layanan Pengaduan Konsumen" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email terkirim ke ${to}: ${info.messageId}`);
  } catch (err) {
    console.error('❌ Gagal kirim email:', err);
  }
}

module.exports = { sendEmail };
