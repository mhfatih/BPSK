-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 20, 2025 at 07:27 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bpsk_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `kasus`
--

CREATE TABLE `kasus` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('Draf','Diproses','Diterima','Ditolak','Selesai') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Draf',
  `alasan_penolakan` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `verified_by` char(36) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kasus`
--

INSERT INTO `kasus` (`id`, `created_by`, `status`, `alasan_penolakan`, `created_at`, `submitted_at`, `verified_at`, `verified_by`) VALUES
('043ab9ae-6481-407b-8b90-3aa3d597ec22', '8fb7b396-3fb6-40ea-b311-ea20b1f38e08', 'Draf', NULL, '2025-10-11 13:20:46', NULL, NULL, NULL),
('17f1c360-3fd3-4d0d-8aca-de5da4cdee45', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-20 06:20:39', NULL, NULL, NULL),
('1d4debc2-b6a9-4c7e-a1bf-d41def96fd6c', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-20 06:22:27', NULL, NULL, NULL),
('24951048-5e3d-4094-8f6f-c401aa3a1375', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-20 06:22:42', NULL, NULL, NULL),
('25db1cdc-39ad-4e0a-a1c6-5206445f8f8a', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-12 08:13:25', NULL, NULL, NULL),
('81f1c533-ae10-4f9a-92e3-9d6167b154c4', 'cab05a4d-3105-4606-9c18-17a8074089ac', 'Draf', NULL, '2025-10-13 08:41:06', NULL, NULL, NULL),
('8813cd49-b689-4c6c-94ed-24bb68b40672', 'acee6061-f431-4f1c-b4ff-793986628cd2', 'Diterima', NULL, '2025-10-06 07:27:47', '2025-10-10 08:11:55', '2025-10-10 08:12:28', '148ac14b-62f3-4f97-8203-60cf7057c5b1'),
('8dd50f9e-f744-4dcc-b17d-1c5bf3ab3249', 'acee6061-f431-4f1c-b4ff-793986628cd2', 'Draf', NULL, '2025-10-06 05:01:06', NULL, NULL, NULL),
('923e6d1a-0511-4cb6-bf51-6bf22660920a', '7d095850-8898-4991-9373-5b50a5eb2576', 'Diterima', 'Bukti tidak valid', '2025-10-20 06:28:20', '2025-10-20 06:49:17', '2025-10-20 06:49:23', '7d095850-8898-4991-9373-5b50a5eb2576'),
('964dddd9-c8c7-4d37-a6fc-5ec3a1e148aa', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-03 06:45:00', NULL, NULL, NULL),
('98f2c359-0184-47cd-8e9c-40d36827a77e', '8fb7b396-3fb6-40ea-b311-ea20b1f38e08', 'Draf', NULL, '2025-10-03 06:55:52', NULL, NULL, NULL),
('b32f50a6-d3a3-4da0-924f-3892e82ccc3f', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-20 06:25:02', NULL, NULL, NULL),
('b5933992-603a-4fb8-8bff-1a10608ad7dc', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-03 06:55:19', NULL, NULL, NULL),
('b7ea1c25-b505-4ad7-907e-8dbda539aab1', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-20 06:24:31', NULL, NULL, NULL),
('bb0c28e7-4510-4262-92bf-945711cf792f', 'cb8b6406-e906-4287-b04c-bf655834f7e1', 'Diterima', NULL, '2025-10-11 14:05:38', '2025-10-12 07:14:02', '2025-10-12 11:16:01', '148ac14b-62f3-4f97-8203-60cf7057c5b1'),
('bef9f107-e498-407d-86ea-7718ab6c40ed', 'cb8b6406-e906-4287-b04c-bf655834f7e1', 'Diterima', 'data tidak valid', '2025-10-12 04:54:48', '2025-10-12 11:30:32', '2025-10-12 11:30:52', '7d095850-8898-4991-9373-5b50a5eb2576'),
('e22eee1e-420d-4ed9-8f5e-64e2fc857c8d', 'cb8b6406-e906-4287-b04c-bf655834f7e1', 'Draf', NULL, '2025-10-12 02:31:55', NULL, NULL, NULL),
('e885c4a9-825b-46cc-97b4-7b1b4d13a868', 'acee6061-f431-4f1c-b4ff-793986628cd2', 'Draf', NULL, '2025-10-09 04:31:01', NULL, NULL, NULL),
('f5e644bc-8cd3-4777-b9e6-ce7f619b98e6', 'cab05a4d-3105-4606-9c18-17a8074089ac', 'Diterima', 'data tidak valid', '2025-10-13 02:07:28', '2025-10-13 02:12:24', '2025-10-13 02:12:59', '7d095850-8898-4991-9373-5b50a5eb2576'),
('f63f5887-0a67-4a55-882c-52143f729ac3', 'acee6061-f431-4f1c-b4ff-793986628cd2', 'Draf', NULL, '2025-10-10 07:58:07', NULL, NULL, NULL),
('ff36988b-15b5-467b-8a76-5a9a36aa16d2', '7d095850-8898-4991-9373-5b50a5eb2576', 'Draf', NULL, '2025-10-20 06:26:06', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kasus_data_diri`
--

CREATE TABLE `kasus_data_diri` (
  `kasus_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_lengkap` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `umur` int DEFAULT NULL,
  `jenis_kelamin` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kota` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_general_ci,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kode_pos` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `identitas` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto_identitas` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kasus_data_diri`
--

INSERT INTO `kasus_data_diri` (`kasus_id`, `nama_lengkap`, `umur`, `jenis_kelamin`, `kota`, `alamat`, `email`, `no_hp`, `kode_pos`, `identitas`, `foto_identitas`) VALUES
('043ab9ae-6481-407b-8b90-3aa3d597ec22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('17f1c360-3fd3-4d0d-8aca-de5da4cdee45', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1d4debc2-b6a9-4c7e-a1bf-d41def96fd6c', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('24951048-5e3d-4094-8f6f-c401aa3a1375', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25db1cdc-39ad-4e0a-a1c6-5206445f8f8a', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('81f1c533-ae10-4f9a-92e3-9d6167b154c4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('8813cd49-b689-4c6c-94ed-24bb68b40672', 'Budi Santoso', 20, 'Laki-laki', 'Serang', 'Jl. Raya Cilegon No.5', 'budi@example.com', '08123456789', '42111', '01234865932553', '/uploads/acee6061-f431-4f1c-b4ff-793986628cd2/kasus/8813cd49-b689-4c6c-94ed-24bb68b40672/identitas.jpg'),
('8dd50f9e-f744-4dcc-b17d-1c5bf3ab3249', 'User Empat', 20, 'Laki-laki', 'Serang', 'Jl. Merdeka No. 10', 'user4@gmail.com', '08123456789', '42118', '1234567890', '/uploads/acee6061-f431-4f1c-b4ff-793986628cd2/kasus/8dd50f9e-f744-4dcc-b17d-1c5bf3ab3249/identitas.jpg'),
('923e6d1a-0511-4cb6-bf51-6bf22660920a', 'Budi Santoso', 20, 'Laki-laki', 'Serang', 'Jl. Raya Cilegon No.5', 'budi@example.com', '08123456789', '42111', '01234865932553', '/uploads/7d095850-8898-4991-9373-5b50a5eb2576/kasus/923e6d1a-0511-4cb6-bf51-6bf22660920a/identitas.jpg'),
('b32f50a6-d3a3-4da0-924f-3892e82ccc3f', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('b7ea1c25-b505-4ad7-907e-8dbda539aab1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('bb0c28e7-4510-4262-92bf-945711cf792f', 'Muhammad Fatih Bari', 21, 'laki-laki', 'Cilegon', 'cilegon damai', 'fatih@gmail.com', '082180587421', '42414', '36720062', '/uploads/cb8b6406-e906-4287-b04c-bf655834f7e1/kasus/bb0c28e7-4510-4262-92bf-945711cf792f/identitas.png'),
('bef9f107-e498-407d-86ea-7718ab6c40ed', 'Muhammad Fatih Bari', 21, 'laki-laki', 'Cilegon', 'cilegon damai', 'fatih@gmail.com', '082180587421', '42414', '3337220062', '/uploads/cb8b6406-e906-4287-b04c-bf655834f7e1/kasus/bef9f107-e498-407d-86ea-7718ab6c40ed/identitas.png'),
('e22eee1e-420d-4ed9-8f5e-64e2fc857c8d', 'Muhammad Fatih Bari', 21, 'laki-laki', 'Cilegon', 'cilegon damai', 'fatih@gmail.com', '082180587421', '42414', '3337220062', '/uploads/cb8b6406-e906-4287-b04c-bf655834f7e1/kasus/e22eee1e-420d-4ed9-8f5e-64e2fc857c8d/identitas.png'),
('f5e644bc-8cd3-4777-b9e6-ce7f619b98e6', 'Adilah', 21, 'laki-laki', 'Pandeglang', 'Pandeglang damai indah', 'adi@gmail.com', '8463925235', '43431', '3337220062', '/uploads/cab05a4d-3105-4606-9c18-17a8074089ac/kasus/f5e644bc-8cd3-4777-b9e6-ce7f619b98e6/identitas.png'),
('ff36988b-15b5-467b-8a76-5a9a36aa16d2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kasus_kronologis`
--

CREATE TABLE `kasus_kronologis` (
  `kasus_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `kronologis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `jenis_tuntutan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kasus_kronologis`
--

INSERT INTO `kasus_kronologis` (`kasus_id`, `kronologis`, `jenis_tuntutan`) VALUES
('043ab9ae-6481-407b-8b90-3aa3d597ec22', '', ''),
('25db1cdc-39ad-4e0a-a1c6-5206445f8f8a', '', ''),
('81f1c533-ae10-4f9a-92e3-9d6167b154c4', '', ''),
('8813cd49-b689-4c6c-94ed-24bb68b40672', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius itaque blanditiis neque corporis ipsum fugit sunt iure est expedita. Doloremque officia, iusto sunt id incidunt veniam quod omnis quisquam non, velit dicta dolor? Placeat, sit optio labore inventore quod quis consequatur omnis, nobis laudantium tenetur fuga impedit assumenda officiis distinctio quae nam. Quidem repellendus voluptatibus autem consectetur quisquam ad, amet minus? Temporibus maiores, et sunt molestias dolore saepe. Facere nisi nobis dolorum quisquam, aspernatur quasi numquam voluptates reiciendis molestiae expedita sit iure nam ea. Ducimus, optio sunt labore ratione odio neque quisquam. Voluptates assumenda neque odio alias impedit rerum!', 'Pengembalian uang sebesar Rp2.500.000'),
('923e6d1a-0511-4cb6-bf51-6bf22660920a', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius itaque blanditiis neque corporis ipsum fugit sunt iure est expedita. Doloremque officia, iusto sunt id incidunt veniam quod omnis quisquam non, velit dicta dolor? Placeat, sit optio labore inventore quod quis consequatur omnis, nobis laudantium tenetur fuga impedit assumenda officiis distinctio quae nam. Quidem repellendus voluptatibus autem consectetur quisquam ad, amet minus? Temporibus maiores, et sunt molestias dolore saepe. Facere nisi nobis dolorum quisquam, aspernatur quasi numquam voluptates reiciendis molestiae expedita sit iure nam ea. Ducimus, optio sunt labore ratione odio neque quisquam. Voluptates assumenda neque odio alias impedit rerum!', 'Pengembalian uang sebesar Rp2.500.000'),
('bb0c28e7-4510-4262-92bf-945711cf792f', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius itaque blanditiis neque corporis ipsum fugit sunt iure est expedita. Doloremque officia, iusto sunt id incidunt veniam quod omnis quisquam non, velit dicta dolor? Placeat, sit optio labore inventore quod quis consequatur omnis, nobis laudantium tenetur fuga impedit assumenda officiis distinctio quae nam. Quidem repellendus voluptatibus autem consectetur quisquam ad, amet minus? Temporibus maiores, et sunt molestias dolore saepe. Facere nisi nobis dolorum quisquam, aspernatur quasi numquam voluptates reiciendis molestiae expedita sit iure nam ea. Ducimus, optio sunt labore ratione odio neque quisquam. Voluptates assumenda neque odio alias impedit rerum!', 'Uang gua balikin'),
('bef9f107-e498-407d-86ea-7718ab6c40ed', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius itaque blanditiis neque corporis ipsum fugit sunt iure est expedita. Doloremque officia, iusto sunt id incidunt veniam quod omnis quisquam non, velit dicta dolor? Placeat, sit optio labore inventore quod quis consequatur omnis, nobis laudantium tenetur fuga impedit assumenda officiis distinctio quae nam. Quidem repellendus voluptatibus autem consectetur quisquam ad, amet minus? Temporibus maiores, et sunt molestias dolore saepe. Facere nisi nobis dolorum quisquam, aspernatur quasi numquam voluptates reiciendis molestiae expedita sit iure nam ea. Ducimus, optio sunt labore ratione odio neque quisquam. Voluptates assumenda neque odio alias impedit rerum! anjay', 'uanggg guaa'),
('e22eee1e-420d-4ed9-8f5e-64e2fc857c8d', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius itaque blanditiis neque corporis ipsum fugit sunt iure est expedita. Doloremque officia, iusto sunt id incidunt veniam quod omnis quisquam non, velit dicta dolor? Placeat, sit optio labore inventore quod quis consequatur omnis, nobis laudantium tenetur fuga impedit assumenda officiis distinctio quae nam. Quidem repellendus voluptatibus autem consectetur quisquam ad, amet minus? Temporibus maiores, et sunt molestias dolore saepe. Facere nisi nobis dolorum quisquam, aspernatur quasi numquam voluptates reiciendis molestiae expedita sit iure nam ea. Ducimus, optio sunt labore ratione odio neque quisquam. Voluptates assumenda neque odio alias impedit rerum!', 'uang'),
('f5e644bc-8cd3-4777-b9e6-ce7f619b98e6', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus eius itaque blanditiis neque corporis ipsum fugit sunt iure est expedita. Doloremque officia, iusto sunt id incidunt veniam quod omnis quisquam non, velit dicta dolor? Placeat, sit optio labore inventore quod quis consequatur omnis, nobis laudantium tenetur fuga impedit assumenda officiis distinctio quae nam. Quidem repellendus voluptatibus autem consectetur quisquam ad, amet minus? Temporibus maiores, et sunt molestias dolore saepe. Facere nisi nobis dolorum quisquam, aspernatur quasi numquam voluptates reiciendis molestiae expedita sit iure nam ea. Ducimus, optio sunt labore ratione odio neque quisquam. Voluptates assumenda neque odio alias impedit rerum', 'uang kembali');

-- --------------------------------------------------------

--
-- Table structure for table `kasus_pelaku_usaha`
--

CREATE TABLE `kasus_pelaku_usaha` (
  `kasus_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_pemilik` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `perusahaan` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kota` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alamat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `kode_pos` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `no_hp` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `faksimile` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kasus_pelaku_usaha`
--

INSERT INTO `kasus_pelaku_usaha` (`kasus_id`, `nama_pemilik`, `perusahaan`, `kota`, `alamat`, `kode_pos`, `no_hp`, `faksimile`) VALUES
('043ab9ae-6481-407b-8b90-3aa3d597ec22', '', '', '', '', '', '', NULL),
('25db1cdc-39ad-4e0a-a1c6-5206445f8f8a', '', '', '', '', '', '', NULL),
('81f1c533-ae10-4f9a-92e3-9d6167b154c4', '', '', '', '', '', '', NULL),
('8813cd49-b689-4c6c-94ed-24bb68b40672', 'Budi Santoso', 'PT Maju Jaya', 'Jakarta', 'Jl. Merdeka No. 123', '10110', '081234567890', '021-1234567'),
('923e6d1a-0511-4cb6-bf51-6bf22660920a', 'Budi Santoso', 'PT Maju Jaya', 'Jakarta', 'Jl. Merdeka No. 123', '10110', '081234567890', '021-1234567'),
('98f2c359-0184-47cd-8e9c-40d36827a77e', 'Budi Santoso', 'PT Maju Jaya', 'Jakarta', 'Jl. Merdeka No. 123', '10110', '081234567890', '021-1234567'),
('bb0c28e7-4510-4262-92bf-945711cf792f', 'Adilah Taufik', 'Sunda Empire', 'Pandeglang', 'Pandeglang damai', '43431', '08463925235', NULL),
('bef9f107-e498-407d-86ea-7718ab6c40ed', 'Adilah Taufik', 'Sunda Empire', 'Pandeglang', 'Pandeglang damai indah', '43431', '08463925235', NULL),
('e22eee1e-420d-4ed9-8f5e-64e2fc857c8d', 'Adilah Taufik', 'Sunda Empire', 'Pandeglang', 'Pandeglang damai', '43431', '8463925235', NULL),
('f5e644bc-8cd3-4777-b9e6-ce7f619b98e6', 'Adilah Taufik', 'Sunda Empire', 'Pandeglang', 'Pandeglang damai indah', '43431', '08463925235', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `kasus_pengaduan`
--

CREATE TABLE `kasus_pengaduan` (
  `kasus_id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `jenis_pengaduan` enum('industri dan pertambangan','pertanian dan kehutanan','standar mutu','jasa','iklan','klausula baku','label','lain-lain') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tanggal_kejadian` date DEFAULT NULL,
  `waktu_kejadian` time DEFAULT NULL,
  `lokasi_kejadian` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `jenis_kerugian` enum('fisik','material') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `keterangan_kerugian` text COLLATE utf8mb4_general_ci,
  `bukti_pembelian` enum('bon pembelian','kwitansi','faktur','tanda terima','lain-lain') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bukti_saksi` enum('ada','tidak ada') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hubungan_saksi` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `barang_bukti` enum('ada','tidak ada','lain-lain') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto_bukti` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kasus_pengaduan`
--

INSERT INTO `kasus_pengaduan` (`kasus_id`, `jenis_pengaduan`, `tanggal_kejadian`, `waktu_kejadian`, `lokasi_kejadian`, `jenis_kerugian`, `keterangan_kerugian`, `bukti_pembelian`, `bukti_saksi`, `hubungan_saksi`, `barang_bukti`, `foto_bukti`) VALUES
('043ab9ae-6481-407b-8b90-3aa3d597ec22', 'industri dan pertambangan', '0000-00-00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('25db1cdc-39ad-4e0a-a1c6-5206445f8f8a', 'industri dan pertambangan', '0000-00-00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('81f1c533-ae10-4f9a-92e3-9d6167b154c4', 'industri dan pertambangan', '0000-00-00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('8813cd49-b689-4c6c-94ed-24bb68b40672', 'industri dan pertambangan', '2025-10-07', '10:30:00', 'Cilegon', 'material', 'Barang tidak berfungsi setelah 2 hari', 'tanda terima', 'ada', 'teman kerja', 'ada', '/uploads/acee6061-f431-4f1c-b4ff-793986628cd2/kasus/8813cd49-b689-4c6c-94ed-24bb68b40672/foto_bukti_1760083893219.png'),
('923e6d1a-0511-4cb6-bf51-6bf22660920a', 'industri dan pertambangan', '2025-10-07', '10:30:00', 'Cilegon', 'material', 'Barang tidak berfungsi setelah 2 hari', 'tanda terima', 'ada', 'teman kerja', 'ada', '/uploads/7d095850-8898-4991-9373-5b50a5eb2576/kasus/923e6d1a-0511-4cb6-bf51-6bf22660920a/foto_bukti_1760942239552.png'),
('bb0c28e7-4510-4262-92bf-945711cf792f', 'industri dan pertambangan', '2025-10-07', '08:15:00', 'Pandeglang, Toko Sunda Empire', 'material', 'Uang saya ilang 45 juta rupiah', 'bon pembelian', 'ada', 'Teman kerja', 'ada', '/uploads/cb8b6406-e906-4287-b04c-bf655834f7e1/kasus/bb0c28e7-4510-4262-92bf-945711cf792f/foto_bukti_1760192379007.jpg'),
('bef9f107-e498-407d-86ea-7718ab6c40ed', 'industri dan pertambangan', '2025-09-28', '18:00:00', 'Pandeglang, Toko Sunda Empire', 'material', 'uang 45 juta rupiah', 'bon pembelian', 'ada', 'Teman kerja', 'ada', '/uploads/cb8b6406-e906-4287-b04c-bf655834f7e1/kasus/bef9f107-e498-407d-86ea-7718ab6c40ed/foto_bukti_1760245546033.png'),
('e22eee1e-420d-4ed9-8f5e-64e2fc857c8d', 'industri dan pertambangan', '0000-00-00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('f5e644bc-8cd3-4777-b9e6-ce7f619b98e6', 'industri dan pertambangan', '2025-09-30', '17:00:00', 'Pandeglang, Toko Sunda Empire', 'material', 'uang 5k', 'bon pembelian', 'ada', 'Teman kerja', 'ada', '/uploads/cab05a4d-3105-4606-9c18-17a8074089ac/kasus/f5e644bc-8cd3-4777-b9e6-ce7f619b98e6/foto_bukti_1760321418853.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `kasus_sidang`
--

CREATE TABLE `kasus_sidang` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `kasus_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sidang_ke` int DEFAULT NULL,
  `tanggal_sidang` date DEFAULT NULL,
  `jam_mulai` time DEFAULT NULL,
  `jam_selesai` time DEFAULT NULL,
  `hasil_sidang` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `user_id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_lengkap` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_general_ci,
  `kota` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kode_pos` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `identitas` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto_identitas` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`user_id`, `nama_lengkap`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `kota`, `kode_pos`, `no_hp`, `identitas`, `foto_identitas`, `updated_at`) VALUES
('148ac14b-62f3-4f97-8203-60cf7057c5b1', 'Admin Satu', '2000-01-01', 'Laki-laki', 'Jl. Merdeka No. 10', 'Serang', '42118', '08123456789', '1234567890', '/uploads/148ac14b-62f3-4f97-8203-60cf7057c5b1/profile/identitas.png', '2025-10-14 02:52:01'),
('4d4ab562-cd22-41dc-848b-428826b245e1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 02:51:50'),
('58a94eae-7f95-4efc-97cc-349dfbb9e1db', 'User Lima', '2000-01-01', 'Laki-laki', 'Jl. Merdeka No. 10', 'Serang', '42118', '08123456789', '1234567890', '/uploads/58a94eae-7f95-4efc-97cc-349dfbb9e1db/profile/identitas.png', '2025-10-14 02:42:19'),
('67b3421b-c035-4faf-bc7f-2ed2fdeeb272', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 02:51:50'),
('7d095850-8898-4991-9373-5b50a5eb2576', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 02:51:50'),
('8fb7b396-3fb6-40ea-b311-ea20b1f38e08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 02:51:50'),
('acee6061-f431-4f1c-b4ff-793986628cd2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 02:51:50'),
('cab05a4d-3105-4606-9c18-17a8074089ac', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 02:51:50'),
('cb8b6406-e906-4287-b04c-bf655834f7e1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 02:51:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin','superadmin') COLLATE utf8mb4_general_ci DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('148ac14b-62f3-4f97-8203-60cf7057c5b1', 'admin@gmail.com', 'admin123', 'admin', '2025-10-02 05:19:46', '2025-10-12 02:45:50'),
('4d4ab562-cd22-41dc-848b-428826b245e1', 'user3@gmail.com', '123456', 'user', '2025-10-02 14:19:39', '2025-10-12 02:45:50'),
('58a94eae-7f95-4efc-97cc-349dfbb9e1db', 'user5@gmail.com', '123456', 'user', '2025-10-14 02:41:22', '2025-10-14 02:42:08'),
('67b3421b-c035-4faf-bc7f-2ed2fdeeb272', 'user2@gmail.com', '123456', 'user', '2025-10-02 05:19:46', '2025-10-12 02:45:50'),
('7d095850-8898-4991-9373-5b50a5eb2576', 'superadmin@gmail.com', 'super123', 'superadmin', '2025-10-02 05:19:46', '2025-10-12 02:45:50'),
('8fb7b396-3fb6-40ea-b311-ea20b1f38e08', 'user1@gmail.com', '123456', 'user', '2025-10-02 05:19:46', '2025-10-12 02:45:50'),
('acee6061-f431-4f1c-b4ff-793986628cd2', 'user4@gmail.com', '123456', 'user', '2025-10-03 08:08:22', '2025-10-12 02:45:50'),
('cab05a4d-3105-4606-9c18-17a8074089ac', 'adi@gmail.com', '123456', 'user', '2025-10-13 02:05:59', '2025-10-13 02:07:18'),
('cb8b6406-e906-4287-b04c-bf655834f7e1', 'fatihbari37@gmail.com', 'fatih123', 'user', '2025-10-11 08:57:10', '2025-10-12 02:50:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kasus`
--
ALTER TABLE `kasus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `verified_by` (`verified_by`);

--
-- Indexes for table `kasus_data_diri`
--
ALTER TABLE `kasus_data_diri`
  ADD PRIMARY KEY (`kasus_id`);

--
-- Indexes for table `kasus_kronologis`
--
ALTER TABLE `kasus_kronologis`
  ADD PRIMARY KEY (`kasus_id`);

--
-- Indexes for table `kasus_pelaku_usaha`
--
ALTER TABLE `kasus_pelaku_usaha`
  ADD PRIMARY KEY (`kasus_id`);

--
-- Indexes for table `kasus_pengaduan`
--
ALTER TABLE `kasus_pengaduan`
  ADD PRIMARY KEY (`kasus_id`);

--
-- Indexes for table `kasus_sidang`
--
ALTER TABLE `kasus_sidang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kasus_id` (`kasus_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kasus`
--
ALTER TABLE `kasus`
  ADD CONSTRAINT `kasus_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `kasus_ibfk_2` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `kasus_kronologis`
--
ALTER TABLE `kasus_kronologis`
  ADD CONSTRAINT `kasus_kronologis_ibfk_1` FOREIGN KEY (`kasus_id`) REFERENCES `kasus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kasus_pelaku_usaha`
--
ALTER TABLE `kasus_pelaku_usaha`
  ADD CONSTRAINT `kasus_pelaku_usaha_ibfk_1` FOREIGN KEY (`kasus_id`) REFERENCES `kasus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kasus_sidang`
--
ALTER TABLE `kasus_sidang`
  ADD CONSTRAINT `kasus_sidang_ibfk_1` FOREIGN KEY (`kasus_id`) REFERENCES `kasus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
