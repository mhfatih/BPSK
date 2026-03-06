import jwt from "jsonwebtoken";
import "dotenv/config";
import * as userService from "../modules/user/service/service.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type !== "access") {
      throw new Error("Token tidak valid");
    }

    const user = await userService.getAuth(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};
