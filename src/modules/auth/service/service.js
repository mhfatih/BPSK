import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import * as repo from "../repository/repository.js";
import * as userRepo from "../../user/repository/repository.js";
import * as userService from "../../user/service/service.js";
import * as otpRepo from "../../otp/repository/repository.js";
import * as roleRepo from "../../role/repository/repository.js";
import * as urRepo from "../../userRole/repository/repository.js";
import * as mailer from "./mailer.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (name, email, password) => {
    const existing = await userRepo.getByEmail(email);
    const hashedPassword = await bcrypt.hash(password, 10);

    let userId;
    if (existing) {
        if (existing.is_verified)
            throw new Error("Email sudah terdaftar");
        userId = existing.id;
        await userRepo.changePassword(userId, hashedPassword);
    } else {
        userId = uuidv4();
        await userRepo.create(userId, name, email, hashedPassword, 0);
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await otpRepo.create(userId, otpHash, expiresAt);

    mailer.sendOTP(email, otp).catch(err => {
        console.error("Gagal kirim email:", err.message);
    });
    return { message: "OTP berhasil dikirim" };
};

export const verifyOtp = async (email, otpInput) => {
    const user = await userRepo.getByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.is_verified) throw new Error("User sudah terverifikasi");
    const userId = user.id;
    const otpData = await otpRepo.getOtp(userId);
    if (!otpData) throw new Error("OTP not found");
    if (new Date() > new Date(otpData.expires_at)) throw new Error("OTP sudah kadaluarsa");
    const isMatch = await bcrypt.compare(otpInput, otpData.otp_hash);
    if (!isMatch) throw new Error("OTP salah");

    await userRepo.verify(userId, 1);
    await otpRepo.remove(userId);

    const role = await roleRepo.getByName("User");
    if (!role) throw new Error("Role not found");
    await urRepo.create(uuidv4(), userId, role.id)

    const token = jwt.sign(
        { id: user.id, type: "access" },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    delete user.password;
    return { message: "Verifikasi berhasil", user, token };
};

export const resendOtp = async (email) => {
    const user = await userRepo.getByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.is_verified) throw new Error("User sudah terverifikasi");
    const userId = user.id;

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await otpRepo.create(userId, otpHash, expiresAt);

    mailer.sendOTP(email, otp).catch(err => {
        console.error("Gagal kirim email:", err.message);
    });
    return { message: "OTP baru berhasil dikirim" };
};

export const login = async (email, password) => {
    if (!email || !password) throw new Error("Email dan password wajib diisi");
    const user = await userRepo.getByEmail(email);
    if (!user) throw new Error("Email atau password salah");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Email atau password salah");
    if (user.is_verified === 0) throw new Error("Email atau password salah");

    const token = jwt.sign(
        { id: user.id, type: "access" },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    const fullUser = await userService.getAuth(user.id);
    return { user: fullUser, token };
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await userRepo.getById(userId);
    if (!user) throw new Error("User not found");
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Password lama salah");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepo.changePassword(userId, hashedPassword);
    return true;
};

export const forgotPassword = async (email) => {
    const user = await userRepo.getByEmail(email);
    if (!user) return { message: "Jika email terdaftar, link reset akan dikirim" };

    const resetToken = jwt.sign(
        { id: user.id, passwordHash: user.password, type: "reset" },
        JWT_SECRET,
        { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    mailer.resetPassword(email, resetLink).catch(err => {
        console.error("Gagal kirim email:", err.message);
    });
    return { message: "Jika email terdaftar, link reset akan dikirim" };
};

export const resetPassword = async (token, newPassword) => {
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== "reset") throw new Error("Token tidak valid");
    } catch (err) {
        throw new Error("Token tidak valid atau kadaluarsa");
    }
    const user = await userRepo.getById(decoded.id);
    if (!user) throw new Error("Token tidak valid");
    if (user.password !== decoded.passwordHash) throw new Error("Token sudah tidak berlaku");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepo.changePassword(user.id, hashedPassword);
    return { message: "Password berhasil direset" };
};