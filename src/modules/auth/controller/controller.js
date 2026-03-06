import "dotenv/config";
import * as service from "../service/service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await service.register(name, email, password);

    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = await service.verifyOtp(email, otp);

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await service.resendOtp(email);

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await service.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //kalau production ubah ke true
      sameSite: "lax", // kalau production ubah ke none
      maxAge: 1 * 60 * 60 * 1000
    });

    res.json({
      message: "Login berhasil",
      user
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    await service.changePassword(userId, oldPassword, newPassword);

    res.clearCookie("token");
    res.status(200).json({ message: "Password berhasil diganti, silakan login kembali" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const data = await service.forgotPassword(email);

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const data = await service.resetPassword(token, newPassword);

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
