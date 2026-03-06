import { db } from "../../../config/database.js";

export const getOtp = async (userId) => {
  const [rows] = await db.query("SELECT * FROM otp WHERE user_id = ?", [userId]);
  return rows[0];
};

export const create = async (userId, otpHash, expiresAt) => {
  await db.query(
    `INSERT INTO otp (user_id, otp_hash, expires_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       otp_hash = VALUES(otp_hash),
       expires_at = VALUES(expires_at)`,
    [userId, otpHash, expiresAt]
  );
};

export const remove = async (userId) => {
  await db.query("DELETE FROM otp WHERE user_id = ?", [userId]);
};
