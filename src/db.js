// // USERS
// const users = [
//   {
//     id: '8fb7b396-3fb6-40ea-b311-ea20b1f38e08',
//     email: 'user1@gmail.com',
//     password: '123456',
//     role: 'user', // default user
//     profile: {
//       namaLengkap: 'User Satu',
//       tanggalLahir: '2000-01-01',
//       jenisKelamin: 'Laki-laki',
//       kota: 'Kota Cilegon',
//       alamat: 'Jl. Mawar No. 123',
//       kodePos: '12345',
//       noHp: '08123456789',
//       identitas: '1234567890123456',
//     },
//   },
//   {
//     id: '67b3421b-c035-4faf-bc7f-2ed2fdeeb272',
//     email: 'user2@gmail.com',
//     password: '123456',
//     role: 'user', // default user
//     profile: {
//       namaLengkap: 'User Dua',
//       tanggalLahir: '2000-01-01',
//       jenisKelamin: 'Laki-laki',
//       kota: 'Kota Serang',
//       alamat: 'Jl. Mawar No. 123',
//       kodePos: '12345',
//       noHp: '08123456789',
//       identitas: '1234567890123456',
//     },
//   },
//   {
//     id: '148ac14b-62f3-4f97-8203-60cf7057c5b1',
//     email: 'admin@gmail.com',
//     password: 'admin123',
//     role: 'admin', // contoh admin
//     profile: {
//       namaLengkap: 'Admin Satu',
//       tanggalLahir: '1990-03-21',
//       jenisKelamin: 'Laki-laki',
//       kota: 'Kota Tangerang',
//       alamat: 'Jl. Anggrek No. 77',
//       kodePos: '67890',
//       noHp: '081298765432',
//       identitas: '7890123456789012',
//     },
//   },
//   {
//     id: '7d095850-8898-4991-9373-5b50a5eb2576',
//     email: 'superadmin@gmail.com',
//     password: 'super123',
//     role: 'superadmin', // contoh superadmin
//     profile: {
//       namaLengkap: 'Super Admin',
//       tanggalLahir: '1985-12-05',
//       jenisKelamin: 'Perempuan',
//       kota: 'Kabupaten Pandeglang',
//       alamat: 'Jl. Kenanga No. 99',
//       kodePos: '11111',
//       noHp: '082112345678',
//       identitas: '2109876543210987',
//     },
//   },
// ];

// //PENGADUAN
// const kasus = [
//   {
//     id: "c339c334-497b-4b72-ae5e-32b5153f0341",
//     createdBy: "7d095850-8898-4991-9373-5b50a5eb2576",
//     dataDiri: null,
//     dataPelakuUsaha: null,
//     pengaduan: null,
//     kronologis: null,
//     status: "draf", // default
//   },
//   {
//     id: "84b6cf40-468d-4b4f-8fe5-765f17a02827",
//     createdBy: "8fb7b396-3fb6-40ea-b311-ea20b1f38e08",
//     dataDiri: null,
//     dataPelakuUsaha: null,
//     pengaduan: null,
//     kronologis: null,
//     status: "draf", // default
//   },
//   {
//     id: "f372b597-ade9-4c98-9bd5-78ff676fdd82",
//     createdBy: "8fb7b396-3fb6-40ea-b311-ea20b1f38e08",
//     dataDiri: null,
//     dataPelakuUsaha: null,
//     pengaduan: null,
//     kronologis: null,
//     status: "menunggu verifikasi", // default
//   },
// ];

// module.exports = { users, kasus };

const mysql = require('mysql2');

// Buat koneksi ke MySQL
const db = mysql.createConnection({
  host: 'bpsk.bantendev.id',
  user: 'bpskbantendev_admin',
  password: '#XZDZA@0Qz}Syi~s',
  database: 'bpskbantendev_db_bpsk'
});

// Cek koneksi
db.connect(err => {
  if (err) {
    console.error('Gagal koneksi ke MySQL:', err);
    return;
  }
  console.log('Berhasil koneksi ke MySQL');
});

module.exports = db;
