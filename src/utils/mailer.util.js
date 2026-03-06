import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // 587 = false, 465 = true
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
      text,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (err) {
    console.error("MAIL SEND ERROR:", err);
    throw new Error("Gagal mengirim email");
  }
};
