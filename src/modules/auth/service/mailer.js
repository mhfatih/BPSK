import { sendMail } from "../../../utils/mailer.util.js";

export const resetPassword = async (email, resetLink) => {
    return sendMail({
        to: email,
        subject: "Reset Password",
        html: `
        <div>
            <h3>Reset Password</h3>
            <p>Klik link berikut untuk reset password Anda:</p>
            <a href="${resetLink}" target="_blank">${resetLink}</a>
            
            <p>Link berlaku selama 15 menit.</p>
        </div>
        `,
    });
};

export const sendOTP = async (email, otp) => {
    return sendMail({
        to: email,
        subject: "Kode OTP Verifikasi Akun",
        html: `
        <div>
            <h3>Verifikasi Email</h3>
            <p>Kode OTP kamu adalah:</p>
            <h2 style="letter-spacing: 3px;">${otp}</h2>
            <p>Kode ini berlaku 5 menit.</p>
        </div>
        `,
    });
};