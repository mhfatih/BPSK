import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true
});

// ======== DB Checker ========
export const checkDBConnection = async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    console.log("📦 Database connected successfully!");
    return true;
  } catch (err) {
    console.error("❌ Database connection error");
    return false;
  }
};
