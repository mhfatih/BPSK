import { db } from "../../../config/database.js";

export const getOtp = async (user_id) => {
  const [rows] = await db.query("SELECT * FROM otp WHERE user_id = ?", [user_id]);
  return rows[0];
};

export const create = async (user_id, otpHash, expiresAt) => {
  await db.query(
    `INSERT INTO otp (user_id, otp_hash, expires_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       otp_hash = VALUES(otp_hash),
       expires_at = VALUES(expires_at)`,
    [user_id, otpHash, expiresAt]
  );
};

export const remove = async (user_id) => {
  await db.query("DELETE FROM otp WHERE user_id = ?", [user_id]);
};
