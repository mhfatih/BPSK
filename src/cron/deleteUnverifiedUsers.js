const db = require('../db');

async function deleteUnverifiedUsers() {
  try {
    const [result] = await db.query(`
      DELETE users, profiles
      FROM users
      LEFT JOIN profiles ON profiles.user_id = users.id
      WHERE users.is_verified = 0
      AND users.created_at < NOW() - INTERVAL 30 DAY
    `);

    console.log(`[CRON] ${new Date().toISOString()} - Menghapus akun unverified yang lebih dari 30 hari`);
  } catch (err) {
    console.error("[CRON ERROR]", err);
  }
}

module.exports = deleteUnverifiedUsers;
