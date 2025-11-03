require('dotenv').config();
const nodemailer = require('nodemailer');

async function main() {
  // 🔧 Setup transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true karena pakai port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 📤 Konfigurasi email
  const mailOptions = {
    from: `"Tester Nodemailer" <${process.env.EMAIL_USER}>`,
    to: 'fatihbari37@gmail.com', // ganti ke email penerima
    subject: 'Tes Kirim Email dari Nodemailer',
    html: `<h3>Halo!</h3><p>Ini percobaan kirim email dari <b>Nodemailer</b> 🚀</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email berhasil dikirim:', info.messageId);
  } catch (err) {
    console.error('❌ Gagal kirim email:', err);
  }
}

main();
