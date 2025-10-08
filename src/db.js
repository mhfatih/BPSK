const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bpsk_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Cek koneksi dengan query sederhana
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS hasil');
    console.log('✅ Berhasil koneksi ke MySQL, test query hasil:', rows[0].hasil);
  } catch (err) {
    console.error('❌ Gagal koneksi ke MySQL:', err.message);
  }
})();

module.exports = pool;
