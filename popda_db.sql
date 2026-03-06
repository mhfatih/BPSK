-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 05, 2026 at 04:47 AM
-- Server version: 5.7.39
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `popda_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `athletes`
--

CREATE TABLE `athletes` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `athletes`
--

INSERT INTO `athletes` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('a682f087-4866-4950-bf74-d8bddbcf48d6', 'Gibran', 'Bulutangkis', '2026-02-04 11:39:10', '2026-02-04 11:39:10');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `sport_id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `sport_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('6576dac4-e8d7-4433-84dc-509db657ce3b', '17e6a73d-ac90-4930-87db-43b69d9b388a', 'Ganda Putri', 'Ganda Putri', '2026-01-31 15:28:53', '2026-01-31 15:28:53'),
('685ca5f9-d7fb-486c-b771-8cdacc22264b', '17e6a73d-ac90-4930-87db-43b69d9b388a', 'Tunggal Putri', 'Tunggal Putri', '2026-01-31 15:28:53', '2026-01-31 15:28:53'),
('bea5d10a-8788-4d78-980f-2ae2a0a0f72e', '17e6a73d-ac90-4930-87db-43b69d9b388a', 'Tunggal Putra', 'Tunggal Putra', '2026-01-31 15:28:53', '2026-01-31 15:28:53'),
('e15add47-8981-4bff-a03f-52329c50c6fa', '17e6a73d-ac90-4930-87db-43b69d9b388a', 'Ganda Putra', 'Ganda Putra', '2026-01-31 15:28:53', '2026-01-31 15:28:53');

-- --------------------------------------------------------

--
-- Table structure for table `coaches`
--

CREATE TABLE `coaches` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` char(36) NOT NULL,
  `module_id` varchar(36) NOT NULL,
  `parent_id` varchar(36) NOT NULL,
  `sort_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `module_id`, `parent_id`, `sort_order`, `created_at`, `updated_at`) VALUES
('4a9ad3f8-9b9f-4090-8df5-afa9ca212102', '70e38791-7fb0-4c76-8d4a-756be2db7e0c', '', 2, '2026-02-25 14:36:05', '2026-02-25 14:36:05'),
('cfb158b7-23b0-4788-91e9-75fd78952447', '03abe634-909d-4c19-850e-7697646f7bac', '', 1, '2026-02-25 14:41:26', '2026-02-25 14:41:26');

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `label` varchar(150) NOT NULL,
  `code` varchar(100) NOT NULL,
  `url` varchar(150) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `name`, `label`, `code`, `url`, `icon`, `created_at`, `updated_at`) VALUES
('03abe634-909d-4c19-850e-7697646f7bac', 'menus', 'menus', 'menus', '/menus', 'users', '2026-02-25 14:21:18', '2026-02-25 14:21:18'),
('35caf7f9-bcb1-4b8c-b168-edd36c17557a', 'categories', 'Categories', 'categories', '/categories', NULL, '2026-02-09 13:41:06', '2026-02-09 23:01:58'),
('364f4d93-bbcd-4d7d-8020-7f90a02d8307', 'period territory sports', 'period territory sports', 'period_territory_sports', '/period-territory-sports', 'users', '2026-02-28 07:58:14', '2026-02-28 07:58:14'),
('482c8df9-0d60-4c0f-9e03-30bf5e1d4535', 'period sports', 'Period Sports', 'period_sports', '/period-sports', NULL, '2026-02-09 23:32:34', '2026-02-09 23:32:34'),
('51c8ce82-6f54-4dd3-a5c3-19bba3207685', 'permissions', 'permissions', 'permissions', '/permissions', NULL, '2026-02-09 13:39:34', '2026-02-09 13:39:34'),
('66a06b44-c066-43a5-9f9b-fe5cfcf1a245', 'period territories', 'Period Territories', 'period_territories', '/period-territories', NULL, '2026-02-10 02:08:00', '2026-02-10 02:08:00'),
('70bd2ec9-0e48-4d7d-ac5a-0ac990727a76', 'officials', 'officials', 'officials', '/officials', NULL, '2026-02-09 13:41:20', '2026-02-09 13:41:20'),
('70e38791-7fb0-4c76-8d4a-756be2db7e0c', 'modules', 'Modules', 'modules', '/modules', NULL, '2026-02-09 13:39:07', '2026-02-09 13:39:07'),
('76d3086e-3bc0-458e-afe9-6b5e59fdb0c6', 'coaches', 'coaches', 'coaches', '/coaches', NULL, '2026-02-09 13:41:17', '2026-02-09 13:41:17'),
('842ae67b-dc62-4a3a-bbb1-3ae731915c56', 'user roles', 'User Roles', 'user_roles', '/user-roles', NULL, '2026-02-11 03:35:09', '2026-02-11 03:35:09'),
('91eb479d-cde1-4c9d-9f4b-105667256a0e', 'roles', 'roles', 'roles', '/roles', NULL, '2026-02-09 13:39:24', '2026-02-09 13:39:24'),
('a5cf9b3a-6062-430c-9495-6aac4df04fe5', 'periods', 'periods', 'periods', '/periods', NULL, '2026-02-09 13:40:07', '2026-02-09 13:40:07'),
('c1628631-98a7-4675-beb5-fed3eed30373', 'territories', 'territories', 'territories', '/territories', NULL, '2026-02-09 13:39:53', '2026-02-09 13:39:53'),
('d325e8b5-1a3d-43c4-943f-a58fcdfe13f9', 'role permissions', 'Role Permissions', 'role_permissions', '/role-permissions', NULL, '2026-02-10 06:31:35', '2026-02-10 06:31:35'),
('deed1f29-5fc8-4270-86f7-fb04cdc387b7', 'users', 'Users', 'users', '/users', NULL, '2026-02-09 13:38:56', '2026-02-09 13:38:56'),
('e01f4346-2c5e-493a-ac40-f045bfb09867', 'user territories', 'User Territtories', 'user_territories', '/user-territories', NULL, '2026-02-13 04:58:18', '2026-02-13 04:58:18'),
('f49bc111-d05d-4f9c-a0fe-dd503e23b9e3', 'sports', 'sports', 'sports', '/sports', NULL, '2026-02-09 13:40:48', '2026-02-09 13:40:48'),
('fdecb9b4-8c1c-480a-ad5b-6fa57203fb4b', 'athletes', 'athletes', 'athletes', '/athletes', 'Users', '2026-02-09 13:41:14', '2026-02-19 14:29:06');

-- --------------------------------------------------------

--
-- Table structure for table `officials`
--

CREATE TABLE `officials` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `kelamin` varchar(20) NOT NULL,
  `nik` varchar(50) NOT NULL,
  `pendidikan` varchar(20) NOT NULL,
  `ktp` varchar(255) DEFAULT NULL,
  `foto_diri` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `officials`
--

INSERT INTO `officials` (`id`, `name`, `tanggal_lahir`, `kelamin`, `nik`, `pendidikan`, `ktp`, `foto_diri`, `created_at`, `updated_at`) VALUES
('860fa0d5-fada-4dca-87bb-ed542ab4952f', 'Fatih', '2004-10-10', 'Laki-Laki', '1234567890123455', 's2', NULL, NULL, '2026-02-25 11:03:22', '2026-02-25 11:03:22'),
('86113acf-5867-445b-ace4-2f11b611270e', 'Gibran', '2004-10-10', 'Laki-Laki', '1234567890123456', 's2', NULL, NULL, '2026-02-24 16:52:06', '2026-02-24 16:53:06');

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `user_id` varchar(36) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `periods`
--

CREATE TABLE `periods` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(36) DEFAULT 'Aktif',
  `tahap_1` tinyint(1) DEFAULT NULL,
  `tahap_2` tinyint(1) DEFAULT NULL,
  `tahap_3` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `periods`
--

INSERT INTO `periods` (`id`, `name`, `year`, `start_date`, `end_date`, `status`, `tahap_1`, `tahap_2`, `tahap_3`, `created_at`, `updated_at`) VALUES
('ed176d36-b2dc-43bc-8f7d-643d4571a587', 'POPDA 2025', 2025, '2025-03-25', '2025-11-11', 'aktif', 1, 0, 0, '2026-01-31 19:43:34', '2026-03-05 00:32:54');

-- --------------------------------------------------------

--
-- Table structure for table `period_athletes`
--

CREATE TABLE `period_athletes` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `athlete_id` varchar(36) NOT NULL,
  `territory_id` varchar(36) NOT NULL,
  `sport_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `period_categories`
--

CREATE TABLE `period_categories` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `category_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `period_categories`
--

INSERT INTO `period_categories` (`id`, `period_id`, `category_id`, `created_at`, `updated_at`) VALUES
('511c71f6-ce4d-4029-a36a-6bdf03b3fdec', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', 'e15add47-8981-4bff-a03f-52329c50c6fa', '2026-02-28 14:32:39', '2026-02-28 14:32:39'),
('cf9a6d3e-a125-4198-b20a-f7375a24f196', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '6576dac4-e8d7-4433-84dc-509db657ce3b', '2026-02-28 14:25:49', '2026-02-28 14:25:49');

-- --------------------------------------------------------

--
-- Table structure for table `period_coaches`
--

CREATE TABLE `period_coaches` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `coach_id` varchar(36) NOT NULL,
  `territory_id` varchar(36) NOT NULL,
  `sport_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `period_officials`
--

CREATE TABLE `period_officials` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `territory_id` varchar(36) NOT NULL,
  `official_id` varchar(36) NOT NULL,
  `jabatan` varchar(50) NOT NULL,
  `kontak` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `period_officials`
--

INSERT INTO `period_officials` (`id`, `period_id`, `territory_id`, `official_id`, `jabatan`, `kontak`, `email`, `created_at`, `updated_at`) VALUES
('087c25e1-f95d-404d-9699-b26772e6e45b', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', 'de6a4ff3-46de-459a-a405-e3de23fdf1e2', '86113acf-5867-445b-ace4-2f11b611270e', '', '0', '0', '2026-03-01 17:59:42', '2026-03-01 17:59:42'),
('f77eac14-3539-4bba-af81-3ccd0b233fe7', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '220ff57f-982b-4470-ba16-782e33f343a2', '860fa0d5-fada-4dca-87bb-ed542ab4952f', '', '0', '0', '2026-03-01 18:03:36', '2026-03-01 18:03:36');

-- --------------------------------------------------------

--
-- Table structure for table `period_sports`
--

CREATE TABLE `period_sports` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `sport_id` varchar(36) NOT NULL,
  `male_athletes` int(11) NOT NULL DEFAULT '0',
  `female_athletes` int(11) NOT NULL DEFAULT '0',
  `total_athletes` int(11) NOT NULL DEFAULT '0',
  `total_coaches` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `period_sports`
--

INSERT INTO `period_sports` (`id`, `period_id`, `sport_id`, `male_athletes`, `female_athletes`, `total_athletes`, `total_coaches`, `created_at`, `updated_at`) VALUES
('56f47dc7-07ca-445e-b77c-fe628641b1af', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '17e6a73d-ac90-4930-87db-43b69d9b388a', 5, 5, 10, 2, '2026-02-27 07:39:11', '2026-03-04 09:21:54'),
('779292de-096f-4c5f-8360-5b6c47b25236', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '54b31b4a-7bd1-4ebf-b5ca-fddbe417efe1', 26, 26, 52, 4, '2026-02-27 16:09:21', '2026-02-27 16:09:48');

-- --------------------------------------------------------

--
-- Table structure for table `period_territories`
--

CREATE TABLE `period_territories` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `territory_id` varchar(36) NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `kontak` varchar(20) DEFAULT NULL,
  `total_official` int(11) DEFAULT NULL,
  `form_partisipasi_file` varchar(255) DEFAULT NULL,
  `cabor_partisipasi_file` varchar(255) DEFAULT NULL,
  `sk_kontingen_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `period_territories`
--

INSERT INTO `period_territories` (`id`, `period_id`, `territory_id`, `alamat`, `email`, `kontak`, `total_official`, `form_partisipasi_file`, `cabor_partisipasi_file`, `sk_kontingen_file`, `created_at`, `updated_at`) VALUES
('2b2d6068-61b9-48e1-978a-49f733c5d41e', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', 'de6a4ff3-46de-459a-a405-e3de23fdf1e2', 'serang', 'superadmin@example.com', '081234567890', 8, 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\de6a4ff3-46de-459a-a405-e3de23fdf1e2\\1771493442815-form-partisipasi-file.pdf', 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\de6a4ff3-46de-459a-a405-e3de23fdf1e2\\1771493442816-cabor-partisipasi-file.pdf', 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\de6a4ff3-46de-459a-a405-e3de23fdf1e2\\1771493442816-sk-kontingen-file.pdf', '2026-02-10 04:52:08', '2026-02-19 10:28:35'),
('896da078-d474-4902-a2ef-1dc1831b60a0', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '3ffeab77-4da5-4481-b41f-4a74038c9c87', 'serang', 'superadmin@example.com', NULL, 8, 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\3ffeab77-4da5-4481-b41f-4a74038c9c87\\1772680386975-form-partisipasi-file.pdf', 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\3ffeab77-4da5-4481-b41f-4a74038c9c87\\1772680386975-cabor-partisipasi-file.pdf', 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\3ffeab77-4da5-4481-b41f-4a74038c9c87\\1772680386975-sk-kontingen-file.pdf', '2026-03-05 03:09:11', '2026-03-05 03:13:06'),
('c753e476-664d-4be1-88bb-57eda14c14b2', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '220ff57f-982b-4470-ba16-782e33f343a2', 'serang', 'superadmin@example.com', '081234567890', 8, 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\220ff57f-982b-4470-ba16-782e33f343a2\\1772515724519-form-partisipasi-file.pdf', 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\220ff57f-982b-4470-ba16-782e33f343a2\\1772515724523-cabor-partisipasi-file.pdf', 'uploads\\private\\period\\ed176d36-b2dc-43bc-8f7d-643d4571a587\\territory\\220ff57f-982b-4470-ba16-782e33f343a2\\1772515724526-sk-kontingen-file.pdf', '2026-02-02 16:27:07', '2026-03-03 05:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `period_territory_categories`
--

CREATE TABLE `period_territory_categories` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `territory_id` varchar(36) NOT NULL,
  `category_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `period_territory_categories`
--

INSERT INTO `period_territory_categories` (`id`, `period_id`, `territory_id`, `category_id`, `created_at`, `updated_at`) VALUES
('924775f0-5bc2-46f7-9679-afd21f52460d', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '3e50734b-845c-447e-b4df-7f97ec0cac8b', 'e15add47-8981-4bff-a03f-52329c50c6fa', '2026-02-28 17:46:19', '2026-02-28 17:46:19'),
('92f28883-89ce-4d72-9835-ca1389908b1a', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '3e50734b-845c-447e-b4df-7f97ec0cac8b', '6576dac4-e8d7-4433-84dc-509db657ce3b', '2026-02-28 17:46:19', '2026-02-28 17:46:19'),
('c269933c-644d-454a-b945-69ea4b3a763e', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', 'de6a4ff3-46de-459a-a405-e3de23fdf1e2', '6576dac4-e8d7-4433-84dc-509db657ce3b', '2026-03-01 17:43:47', '2026-03-01 17:43:47'),
('e27672f5-bdd0-4e8b-b25d-aa4bc73d13ee', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', 'de6a4ff3-46de-459a-a405-e3de23fdf1e2', 'e15add47-8981-4bff-a03f-52329c50c6fa', '2026-03-01 17:43:47', '2026-03-01 17:43:47');

-- --------------------------------------------------------

--
-- Table structure for table `period_territory_sports`
--

CREATE TABLE `period_territory_sports` (
  `id` varchar(36) NOT NULL,
  `period_id` varchar(36) NOT NULL,
  `territory_id` varchar(36) NOT NULL,
  `sport_id` varchar(36) NOT NULL,
  `male_athletes` int(11) NOT NULL DEFAULT '0',
  `female_athletes` int(11) NOT NULL DEFAULT '0',
  `total_athletes` int(11) NOT NULL DEFAULT '0',
  `total_coaches` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `period_territory_sports`
--

INSERT INTO `period_territory_sports` (`id`, `period_id`, `territory_id`, `sport_id`, `male_athletes`, `female_athletes`, `total_athletes`, `total_coaches`, `created_at`, `updated_at`) VALUES
('37c80472-c46e-49aa-be03-f5e4d5dcac99', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '3e50734b-845c-447e-b4df-7f97ec0cac8b', '54b31b4a-7bd1-4ebf-b5ca-fddbe417efe1', 26, 26, 52, 4, '2026-02-27 19:31:30', '2026-02-27 19:31:30'),
('d9e15d78-5fdf-4be6-861c-fc103aa28074', 'ed176d36-b2dc-43bc-8f7d-643d4571a587', '3e50734b-845c-447e-b4df-7f97ec0cac8b', '17e6a73d-ac90-4930-87db-43b69d9b388a', 5, 5, 10, 2, '2026-02-02 19:09:16', '2026-02-24 09:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(36) NOT NULL,
  `module_id` varchar(36) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `module_id`, `name`, `created_at`, `updated_at`) VALUES
('04fad4d8-dd61-4a43-af71-5602dfd5bd7c', 'a5cf9b3a-6062-430c-9495-6aac4df04fe5', 'periods.read', '2026-02-09 13:40:07', '2026-02-09 13:40:07'),
('08dd32c0-ce36-4258-ac27-4b684aa6d59b', '70e38791-7fb0-4c76-8d4a-756be2db7e0c', 'modules.delete', '2026-02-09 13:39:07', '2026-02-09 13:39:07'),
('10636f88-c078-41aa-b804-cf635c6dddba', '482c8df9-0d60-4c0f-9e03-30bf5e1d4535', 'period_sports.create', '2026-02-09 23:32:34', '2026-02-09 23:32:34'),
('140cee0f-f021-422a-9cf5-571855fefe27', 'fdecb9b4-8c1c-480a-ad5b-6fa57203fb4b', 'athletes.create', '2026-02-09 13:41:14', '2026-02-09 13:41:14'),
('1b565c4f-41c5-4ce8-b772-8e66bd41cfd3', 'a5cf9b3a-6062-430c-9495-6aac4df04fe5', 'periods.delete', '2026-02-09 13:40:07', '2026-02-09 13:40:07'),
('1cf0f4ea-8fd1-46fb-aeb3-850c116236b8', '66a06b44-c066-43a5-9f9b-fe5cfcf1a245', 'period_territories.read', '2026-02-10 02:08:00', '2026-02-10 02:08:00'),
('1ec8f061-ad13-4cf7-a689-a20884fab3cc', '91eb479d-cde1-4c9d-9f4b-105667256a0e', 'roles.update', '2026-02-09 13:39:24', '2026-02-09 13:39:24'),
('22d9e840-5295-460e-9686-3fa01dbdc577', 'c1628631-98a7-4675-beb5-fed3eed30373', 'territories.delete', '2026-02-09 13:39:53', '2026-02-09 13:39:53'),
('24752f74-0d38-4b4e-ba34-bf669ecdefd1', 'deed1f29-5fc8-4270-86f7-fb04cdc387b7', 'users.read', '2026-02-09 13:38:56', '2026-02-09 13:38:56'),
('2b20b130-0b4e-4f00-a970-e88c263d2844', 'deed1f29-5fc8-4270-86f7-fb04cdc387b7', 'users.delete', '2026-02-09 13:38:56', '2026-02-09 13:38:56'),
('2ed19cac-ba42-4514-b39d-487d14b65cba', '364f4d93-bbcd-4d7d-8020-7f90a02d8307', 'period_territory_sports.update', '2026-02-28 07:58:14', '2026-02-28 07:58:14'),
('2f0c4dc9-6f2d-4a57-8cda-7efb5c951ceb', '76d3086e-3bc0-458e-afe9-6b5e59fdb0c6', 'coaches.create', '2026-02-09 13:41:17', '2026-02-09 13:41:17'),
('391f14dd-31bc-4eb3-b9fa-27e99caeb1f9', 'deed1f29-5fc8-4270-86f7-fb04cdc387b7', 'users.update', '2026-02-09 13:38:56', '2026-02-09 13:38:56'),
('3cfadcd4-329f-4ec6-8335-412f0135dc78', '842ae67b-dc62-4a3a-bbb1-3ae731915c56', 'user_roles.create', '2026-02-11 03:35:10', '2026-02-11 03:35:10'),
('3dfd0b6f-5336-4a02-a373-852c18039621', '76d3086e-3bc0-458e-afe9-6b5e59fdb0c6', 'coaches.update', '2026-02-09 13:41:17', '2026-02-09 13:41:17'),
('3e2b91f9-cf53-40aa-a740-6e5fe2270c0f', 'f49bc111-d05d-4f9c-a0fe-dd503e23b9e3', 'sports.create', '2026-02-09 13:40:48', '2026-02-09 13:40:48'),
('41e1bac6-9c51-4754-84bf-d714c665e058', 'f49bc111-d05d-4f9c-a0fe-dd503e23b9e3', 'sports.delete', '2026-02-09 13:40:48', '2026-02-09 13:40:48'),
('4565bee1-4c09-41b0-b88d-064a61f7efaa', '35caf7f9-bcb1-4b8c-b168-edd36c17557a', 'categories.read', '2026-02-09 13:41:06', '2026-02-09 13:41:06'),
('4754e859-f63a-4453-b6cb-812accde2a2a', '70e38791-7fb0-4c76-8d4a-756be2db7e0c', 'modules.read', '2026-02-09 13:39:07', '2026-02-09 13:39:07'),
('4aff7445-35fc-4320-b093-4ac6943edeb5', '03abe634-909d-4c19-850e-7697646f7bac', 'menus.read', '2026-02-25 14:21:18', '2026-02-25 14:21:18'),
('503f171c-bf14-4deb-b861-dc269d2c7f94', 'e01f4346-2c5e-493a-ac40-f045bfb09867', 'user_territories.delete', '2026-02-13 04:58:18', '2026-02-13 04:58:18'),
('54bee529-c644-4695-91a4-bb13527929f5', '364f4d93-bbcd-4d7d-8020-7f90a02d8307', 'period_territory_sports.create', '2026-02-28 07:58:14', '2026-02-28 07:58:14'),
('57e7b8b9-60c0-4b4f-8e66-7147602389a8', '76d3086e-3bc0-458e-afe9-6b5e59fdb0c6', 'coaches.delete', '2026-02-09 13:41:17', '2026-02-09 13:41:17'),
('59b350ed-0658-4bdd-80f1-bde5527ca7f0', '51c8ce82-6f54-4dd3-a5c3-19bba3207685', 'permissions.read', '2026-02-09 13:39:34', '2026-02-09 13:39:34'),
('6345062e-bb5d-4b99-b7c3-83186e6ea1d7', '66a06b44-c066-43a5-9f9b-fe5cfcf1a245', 'period_territories.update', '2026-02-10 02:08:00', '2026-02-10 02:08:00'),
('64296536-6ed5-42f5-a4d8-d3c842da3db6', '51c8ce82-6f54-4dd3-a5c3-19bba3207685', 'permissions.create', '2026-02-09 13:39:34', '2026-02-09 13:39:34'),
('67bc8fb5-075c-49f2-9732-e832b082dc8f', 'd325e8b5-1a3d-43c4-943f-a58fcdfe13f9', 'role_permissions.update', '2026-02-10 06:31:35', '2026-02-10 06:31:35'),
('6d721f58-c287-4890-8fc6-fe637e7492dc', '51c8ce82-6f54-4dd3-a5c3-19bba3207685', 'permissions.delete', '2026-02-09 13:39:34', '2026-02-09 13:39:34'),
('715e19a2-c166-4511-a714-08638a0df0b2', 'c1628631-98a7-4675-beb5-fed3eed30373', 'territories.read', '2026-02-09 13:39:53', '2026-02-09 13:39:53'),
('72a6124f-d571-4daa-af63-d590d94b2b11', 'd325e8b5-1a3d-43c4-943f-a58fcdfe13f9', 'role_permissions.create', '2026-02-10 06:31:35', '2026-02-10 06:31:35'),
('7302a66b-adb1-457e-8f69-9b72981f1ecf', 'deed1f29-5fc8-4270-86f7-fb04cdc387b7', 'users.create', '2026-02-09 13:38:56', '2026-02-09 13:38:56'),
('732607b3-1a33-4941-84c0-766ed6cf5c0b', 'e01f4346-2c5e-493a-ac40-f045bfb09867', 'user_territories.create', '2026-02-13 04:58:18', '2026-02-13 04:58:18'),
('76c8fda6-7484-4c90-a4c8-c5efcd5ab02c', '03abe634-909d-4c19-850e-7697646f7bac', 'menus.create', '2026-02-25 14:21:18', '2026-02-25 14:21:18'),
('77e1dc2b-1c78-4682-b4c6-372e386af64c', 'd325e8b5-1a3d-43c4-943f-a58fcdfe13f9', 'role_permissions.delete', '2026-02-10 06:31:35', '2026-02-10 06:31:35'),
('7be21133-4472-4561-8d57-5d43b62f4882', '482c8df9-0d60-4c0f-9e03-30bf5e1d4535', 'period_sports.read', '2026-02-09 23:32:34', '2026-02-09 23:32:34'),
('7c808e6f-e3d9-4201-aac6-6f8a8e7ebcc3', '70bd2ec9-0e48-4d7d-ac5a-0ac990727a76', 'officials.delete', '2026-02-09 13:41:20', '2026-02-09 13:41:20'),
('850292f0-3157-4864-8af2-e44fc3fde687', '03abe634-909d-4c19-850e-7697646f7bac', 'menus.delete', '2026-02-25 14:21:18', '2026-02-25 14:21:18'),
('8b69e0b4-3ca8-4753-9e86-1b50cd4b99b2', 'c1628631-98a7-4675-beb5-fed3eed30373', 'territories.create', '2026-02-09 13:39:53', '2026-02-09 13:39:53'),
('8d3e66ef-da25-479c-aab2-d7a36701b55e', '35caf7f9-bcb1-4b8c-b168-edd36c17557a', 'categories.update', '2026-02-09 13:41:06', '2026-02-09 13:41:06'),
('8d7faa83-adf4-4ec5-9495-3aa8a8d0132f', '842ae67b-dc62-4a3a-bbb1-3ae731915c56', 'user_roles.delete', '2026-02-11 03:35:10', '2026-02-11 03:35:10'),
('91f3b8e6-fb9f-40de-a6cd-0d242e9ab033', 'f49bc111-d05d-4f9c-a0fe-dd503e23b9e3', 'sports.read', '2026-02-09 13:40:48', '2026-02-09 13:40:48'),
('999ba3d8-4ec3-4706-b21b-b4b8a420eda3', '66a06b44-c066-43a5-9f9b-fe5cfcf1a245', 'period_territories.create', '2026-02-10 02:08:00', '2026-02-10 02:08:00'),
('a0826b5d-dc91-43dc-87e7-ed2513abf7b8', '35caf7f9-bcb1-4b8c-b168-edd36c17557a', 'categories.delete', '2026-02-09 13:41:06', '2026-02-09 13:41:06'),
('a1a7bd87-606a-4a49-8828-0ec9162d78e0', '35caf7f9-bcb1-4b8c-b168-edd36c17557a', 'categories.create', '2026-02-09 13:41:06', '2026-02-09 13:41:06'),
('a1b82a98-7795-42fe-9a31-c31a55bccf2a', 'd325e8b5-1a3d-43c4-943f-a58fcdfe13f9', 'role_permissions.read', '2026-02-10 06:31:35', '2026-02-10 06:31:35'),
('ab520333-d574-47cb-9fbc-6fdc544775e6', '70e38791-7fb0-4c76-8d4a-756be2db7e0c', 'modules.update', '2026-02-09 13:39:07', '2026-02-09 13:39:07'),
('b0d981a9-d5cc-4917-8f66-79837348ef89', '66a06b44-c066-43a5-9f9b-fe5cfcf1a245', 'period_territories.delete', '2026-02-10 02:08:00', '2026-02-10 02:08:00'),
('b11aa7ca-8ac2-4c92-aff9-358a3f449482', '51c8ce82-6f54-4dd3-a5c3-19bba3207685', 'permissions.update', '2026-02-09 13:39:34', '2026-02-09 13:39:34'),
('b85ddd28-edc5-4122-b454-0f291bf64ca5', 'fdecb9b4-8c1c-480a-ad5b-6fa57203fb4b', 'athletes.delete', '2026-02-09 13:41:14', '2026-02-09 13:41:14'),
('b9b30bfc-c3e4-44d7-b9b2-4c0f2fbd0828', '91eb479d-cde1-4c9d-9f4b-105667256a0e', 'roles.delete', '2026-02-09 13:39:24', '2026-02-09 13:39:24'),
('ba84d351-d065-4905-9ad8-23f1c7a0d3d3', 'a5cf9b3a-6062-430c-9495-6aac4df04fe5', 'periods.update', '2026-02-09 13:40:07', '2026-02-09 13:40:07'),
('baf363ba-a851-4977-bc54-2d0358a21d31', '70e38791-7fb0-4c76-8d4a-756be2db7e0c', 'modules.create', '2026-02-09 13:39:07', '2026-02-09 13:39:07'),
('bafce9ea-6ba0-463a-bcd5-7817f969fb05', '70bd2ec9-0e48-4d7d-ac5a-0ac990727a76', 'officials.update', '2026-02-09 13:41:20', '2026-02-09 13:41:20'),
('bddd7395-970b-458d-8daa-6ef1af40c86c', '70bd2ec9-0e48-4d7d-ac5a-0ac990727a76', 'officials.create', '2026-02-09 13:41:20', '2026-02-09 13:41:20'),
('beadf418-8907-4af7-8b4b-8fc3f7e75a5e', 'fdecb9b4-8c1c-480a-ad5b-6fa57203fb4b', 'athletes.read', '2026-02-09 13:41:14', '2026-02-09 13:41:14'),
('c02004f9-8685-4606-9c03-14a3eb7c90fa', '03abe634-909d-4c19-850e-7697646f7bac', 'menus.update', '2026-02-25 14:21:18', '2026-02-25 14:21:18'),
('c066aa90-2cc9-4ea2-b8b2-6e3ab59dc865', '364f4d93-bbcd-4d7d-8020-7f90a02d8307', 'period_territory_sports.read', '2026-02-28 07:58:14', '2026-02-28 07:58:14'),
('c0af7c29-cc84-4f9b-bbe4-72795f6a6df7', '76d3086e-3bc0-458e-afe9-6b5e59fdb0c6', 'coaches.read', '2026-02-09 13:41:17', '2026-02-09 13:41:17'),
('ce6e1121-bf11-4c56-93d3-0796871d44fd', '91eb479d-cde1-4c9d-9f4b-105667256a0e', 'roles.create', '2026-02-09 13:39:24', '2026-02-09 13:39:24'),
('da11561c-eab8-49d9-acf5-7a8400306c35', 'e01f4346-2c5e-493a-ac40-f045bfb09867', 'user_territories.update', '2026-02-13 04:58:18', '2026-02-13 04:58:18'),
('de0f52e0-85a3-4c48-8ae5-d975fc0b0e29', 'c1628631-98a7-4675-beb5-fed3eed30373', 'territories.update', '2026-02-09 13:39:53', '2026-02-09 13:39:53'),
('de892128-1929-4cb8-86ba-1373a9c60ade', '842ae67b-dc62-4a3a-bbb1-3ae731915c56', 'user_roles.update', '2026-02-11 03:35:10', '2026-02-11 03:35:10'),
('e0c42a3d-c012-4492-9c6d-395b826ca9c5', '842ae67b-dc62-4a3a-bbb1-3ae731915c56', 'user_roles.read', '2026-02-11 03:35:10', '2026-02-11 03:35:10'),
('e121ffbf-0b3e-4309-8ac6-82b012c6c682', '364f4d93-bbcd-4d7d-8020-7f90a02d8307', 'period_territory_sports.delete', '2026-02-28 07:58:14', '2026-02-28 07:58:14'),
('e169f7a8-6537-4346-aed0-c58b8e1fa5cc', '91eb479d-cde1-4c9d-9f4b-105667256a0e', 'roles.read', '2026-02-09 13:39:24', '2026-02-09 13:39:24'),
('e259db09-a8f8-4b33-b17e-b27bd3a1bd9f', 'fdecb9b4-8c1c-480a-ad5b-6fa57203fb4b', 'athletes.update', '2026-02-09 13:41:14', '2026-02-09 13:41:14'),
('e353d5d1-dc7a-459d-aded-3ab9f4e39223', '482c8df9-0d60-4c0f-9e03-30bf5e1d4535', 'period_sports.delete', '2026-02-09 23:32:34', '2026-02-09 23:32:34'),
('e3f86773-0c95-40b8-af5c-8e6e731c1f8d', '482c8df9-0d60-4c0f-9e03-30bf5e1d4535', 'period_sports.update', '2026-02-09 23:32:34', '2026-02-09 23:32:34'),
('e71eae17-86e7-4698-b9ea-e1e92a6526e3', 'a5cf9b3a-6062-430c-9495-6aac4df04fe5', 'periods.create', '2026-02-09 13:40:07', '2026-02-09 13:40:07'),
('eba8c198-2027-4dbf-a2ed-8f967cfa869c', '70bd2ec9-0e48-4d7d-ac5a-0ac990727a76', 'officials.read', '2026-02-09 13:41:20', '2026-02-09 13:41:20'),
('ec397750-15bd-4f54-9c8f-552fbe88142c', 'e01f4346-2c5e-493a-ac40-f045bfb09867', 'user_territories.read', '2026-02-13 04:58:18', '2026-02-13 04:58:18'),
('f92c5f3b-82ad-4d74-abd7-507d040d07e1', 'f49bc111-d05d-4f9c-a0fe-dd503e23b9e3', 'sports.update', '2026-02-09 13:40:48', '2026-02-09 13:40:48');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('2c2b0e35-5399-43f7-8c13-4876cf042fc6', 'User', 'Pengguna Website', '2026-01-31 15:26:21', '2026-01-31 15:26:21'),
('817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'Superadmin', 'Pegang semua kendali', '2026-01-31 15:26:21', '2026-01-31 15:26:21'),
('a5400313-cded-11f0-8b76-00ff43fb69f5', 'Admin', 'Pengelola Website', '2026-01-31 15:26:21', '2026-01-31 15:26:21');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` char(36) NOT NULL,
  `role_id` varchar(36) NOT NULL,
  `permission_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`) VALUES
('aee3990a-28a3-4acb-8b35-9216176e4fa5', '2c2b0e35-5399-43f7-8c13-4876cf042fc6', '4565bee1-4c09-41b0-b88d-064a61f7efaa'),
('b11b995e-d8fe-436f-bf53-454856eccc90', '2c2b0e35-5399-43f7-8c13-4876cf042fc6', 'beadf418-8907-4af7-8b4b-8fc3f7e75a5e'),
('3803de53-04a5-4df9-89a3-658504b3d516', '2c2b0e35-5399-43f7-8c13-4876cf042fc6', 'c0af7c29-cc84-4f9b-bbe4-72795f6a6df7'),
('5a82c7f9-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '04fad4d8-dd61-4a43-af71-5602dfd5bd7c'),
('5a82c261-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '08dd32c0-ce36-4258-ac27-4b684aa6d59b'),
('cdda3636-060f-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '10636f88-c078-41aa-b804-cf635c6dddba'),
('5a82d022-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '140cee0f-f021-422a-9cf5-571855fefe27'),
('5a82c861-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '1b565c4f-41c5-4ce8-b772-8e66bd41cfd3'),
('781e1fe2-0625-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '1cf0f4ea-8fd1-46fb-aeb3-850c116236b8'),
('5a82c61e-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '1ec8f061-ad13-4cf7-a689-a20884fab3cc'),
('5a82c9c6-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '22d9e840-5295-460e-9686-3fa01dbdc577'),
('5a82cba6-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '24752f74-0d38-4b4e-ba34-bf669ecdefd1'),
('5a82cc18-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '2b20b130-0b4e-4f00-a970-e88c263d2844'),
('5a82c42d-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '2f0c4dc9-6f2d-4a57-8cda-7efb5c951ceb'),
('5a82cc8f-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '391f14dd-31bc-4eb3-b9fa-27e99caeb1f9'),
('bbf94698-06fa-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '3cfadcd4-329f-4ec6-8335-412f0135dc78'),
('5a82c4af-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '3dfd0b6f-5336-4a02-a373-852c18039621'),
('5a82cd7b-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '3e2b91f9-cf53-40aa-a740-6e5fe2270c0f'),
('5a82cdf3-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '41e1bac6-9c51-4754-84bf-d714c665e058'),
('5a81aaef-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '4565bee1-4c09-41b0-b88d-064a61f7efaa'),
('5a82c2ce-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '4754e859-f63a-4453-b6cb-812accde2a2a'),
('c0720bc2-c7c0-4e1a-8aa2-c228a242c6e2', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '4aff7445-35fc-4320-b093-4ac6943edeb5'),
('b248a598-0898-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '503f171c-bf14-4deb-b861-dc269d2c7f94'),
('5a82c524-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '57e7b8b9-60c0-4b4f-8e66-7147602389a8'),
('5a81bdbc-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '59b350ed-0658-4bdd-80f1-bde5527ca7f0'),
('781e2804-0625-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '6345062e-bb5d-4b99-b7c3-83186e6ea1d7'),
('5a81be30-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '64296536-6ed5-42f5-a4d8-d3c842da3db6'),
('5cc6f840-064a-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '67bc8fb5-075c-49f2-9732-e832b082dc8f'),
('5a81beb5-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '6d721f58-c287-4890-8fc6-fe637e7492dc'),
('5a82ca38-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '715e19a2-c166-4511-a714-08638a0df0b2'),
('5cc6f8de-064a-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '72a6124f-d571-4daa-af63-d590d94b2b11'),
('5a82ccff-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '7302a66b-adb1-457e-8f69-9b72981f1ecf'),
('b248b245-0898-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '732607b3-1a33-4941-84c0-766ed6cf5c0b'),
('d6ef9cea-066f-4567-a8dc-c178df9cc8ef', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '76c8fda6-7484-4c90-a4c8-c5efcd5ab02c'),
('5cc6f8f1-064a-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '77e1dc2b-1c78-4682-b4c6-372e386af64c'),
('cdda3fdf-060f-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '7be21133-4472-4561-8d57-5d43b62f4882'),
('5a82c063-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '7c808e6f-e3d9-4201-aac6-6f8a8e7ebcc3'),
('560904b4-4b7a-481b-9eab-7b24773aa90e', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '850292f0-3157-4864-8af2-e44fc3fde687'),
('5a82cab3-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '8b69e0b4-3ca8-4753-9e86-1b50cd4b99b2'),
('5a81bc0c-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '8d3e66ef-da25-479c-aab2-d7a36701b55e'),
('bbf9488e-06fa-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '8d7faa83-adf4-4ec5-9495-3aa8a8d0132f'),
('5a82cf14-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '91f3b8e6-fb9f-40de-a6cd-0d242e9ab033'),
('781e282a-0625-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', '999ba3d8-4ec3-4706-b21b-b4b8a420eda3'),
('5a81bcc4-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'a0826b5d-dc91-43dc-87e7-ed2513abf7b8'),
('5a81bd39-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'a1a7bd87-606a-4a49-8828-0ec9162d78e0'),
('5cc6f902-064a-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'a1b82a98-7795-42fe-9a31-c31a55bccf2a'),
('5a82c346-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'ab520333-d574-47cb-9fbc-6fdc544775e6'),
('781e2847-0625-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'b0d981a9-d5cc-4917-8f66-79837348ef89'),
('5a82bede-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'b11aa7ca-8ac2-4c92-aff9-358a3f449482'),
('5a82d0a4-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'b85ddd28-edc5-4122-b454-0f291bf64ca5'),
('5a82c698-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'b9b30bfc-c3e4-44d7-b9b2-4c0f2fbd0828'),
('5a82c8d3-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'ba84d351-d065-4905-9ad8-23f1c7a0d3d3'),
('5a82c3b9-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'baf363ba-a851-4977-bc54-2d0358a21d31'),
('5a82c0e1-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'bafce9ea-6ba0-463a-bcd5-7817f969fb05'),
('5a82c152-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'bddd7395-970b-458d-8daa-6ef1af40c86c'),
('5a82d11b-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'beadf418-8907-4af7-8b4b-8fc3f7e75a5e'),
('861f1ac1-8f94-4e10-b0cb-212aa2159cdd', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'c02004f9-8685-4606-9c03-14a3eb7c90fa'),
('5a82c5a7-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'c0af7c29-cc84-4f9b-bbe4-72795f6a6df7'),
('5a82c70d-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'ce6e1121-bf11-4c56-93d3-0796871d44fd'),
('b248b259-0898-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'da11561c-eab8-49d9-acf5-7a8400306c35'),
('5a82cb2c-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'de0f52e0-85a3-4c48-8ae5-d975fc0b0e29'),
('bbf948a7-06fa-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'de892128-1929-4cb8-86ba-1373a9c60ade'),
('bbf948b8-06fa-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'e0c42a3d-c012-4492-9c6d-395b826ca9c5'),
('5a82c787-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'e169f7a8-6537-4346-aed0-c58b8e1fa5cc'),
('5a82d18e-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'e259db09-a8f8-4b33-b17e-b27bd3a1bd9f'),
('cdda3ff6-060f-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'e353d5d1-dc7a-459d-aded-3ab9f4e39223'),
('cdda4775-060f-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'e3f86773-0c95-40b8-af5c-8e6e731c1f8d'),
('5a82c940-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'e71eae17-86e7-4698-b9ea-e1e92a6526e3'),
('5a82c1d6-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'eba8c198-2027-4dbf-a2ed-8f967cfa869c'),
('b248b26e-0898-11f1-91d4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'ec397750-15bd-4f54-9c8f-552fbe88142c'),
('5a82cf99-05bd-11f1-8db4-00ff43fb69f5', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5', 'f92c5f3b-82ad-4d74-abd7-507d040d07e1');

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('17e6a73d-ac90-4930-87db-43b69d9b388a', 'Bulutangkis', 'Bulutangkis', '2026-01-31 15:26:41', '2026-01-31 15:26:41'),
('54b31b4a-7bd1-4ebf-b5ca-fddbe417efe1', 'Atletik', 'Atletik', '2026-01-31 15:34:08', '2026-01-31 15:34:08');

-- --------------------------------------------------------

--
-- Table structure for table `territories`
--

CREATE TABLE `territories` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `territories`
--

INSERT INTO `territories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('0a9dd655-445c-4dfe-9125-e2e144e0d2eb', 'Kota Tangerang Selatan', 'Kota Tangerang Selatan', '2026-01-31 15:26:48', '2026-01-31 15:26:48'),
('220ff57f-982b-4470-ba16-782e33f343a2', 'Kabupaten Pandeglang', 'Kabupaten Pandeglang', '2026-01-31 15:26:48', '2026-01-31 15:26:48'),
('2806586c-c214-48c7-be7f-6125c5c9fb89', 'Kabupaten Tangerang', 'Kabupaten Tangerang', '2026-01-31 15:26:48', '2026-01-31 15:26:48'),
('337f56f8-f5d5-48c8-bc77-f47171afcdc2', 'Kota Tangerang', 'Kota Tangerang', '2026-01-31 15:26:48', '2026-01-31 15:26:48'),
('3e50734b-845c-447e-b4df-7f97ec0cac8b', 'Kota Cilegon', 'Kota Cilegon', '2026-01-31 15:26:48', '2026-02-22 13:31:34'),
('3ffeab77-4da5-4481-b41f-4a74038c9c87', 'Kota Serang', 'Kota Serang', '2026-01-31 15:26:48', '2026-01-31 15:26:48'),
('6092d03e-db96-46f7-a3bf-bd4ae1197dff', 'Kabupaten Lebak', 'Kabupaten Lebak', '2026-01-31 15:26:48', '2026-01-31 15:26:48'),
('de6a4ff3-46de-459a-a405-e3de23fdf1e2', 'Kabupaten Serang', 'Kabupaten Serang', '2026-01-31 15:26:48', '2026-01-31 15:26:48');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `profile_picture`, `created_at`, `updated_at`, `last_login`, `is_verified`, `verified_at`) VALUES
('41527c0c-709b-4c62-9df2-e98416618c07', 'Fatih', '3337220062@untirta.ac.id', '$2b$10$GYpMfdg8SwErPOZQG03UfOQJArlXIy6QciyXcIEaqe4kTyVlFPHdO', 'public/users/41527c0c-709b-4c62-9df2-e98416618c07/profile_picture_1765756266837.jpeg', '2025-11-30 09:59:52', '2026-02-15 08:36:48', NULL, 1, '2026-02-11 10:50:52'),
('6089b3c2-b0cd-4f4b-99cf-5e50099b9671', 'Kota Tangerang', 'kotatangerang@example.com', '$2b$10$3KiiOntEzRYymjfOld/oDuRTr8RpW.N3t/L3UWOYgIF9SkgtbZRoq', NULL, '2026-02-17 13:01:03', '2026-02-17 13:01:03', NULL, 1, '2026-02-17 13:01:03'),
('67a2798d-d7c6-4339-8521-b51125d4cdaf', 'Kota Cilegon', 'kotacilegon@example.com', '$2b$10$bgcsosf8R8ggWDj/Yzwxx.oY3xHjh0HFv7W3vRHmorNYu3b4itfbC', NULL, '2026-02-13 07:26:26', '2026-02-17 13:09:41', NULL, 1, '2026-02-13 07:26:26'),
('9524e9da-6b3b-42a0-8698-33e47bfb9073', 'Superadmin', 'superadmin@example.com', '$2b$10$vJ4DTAUVCWDXDwkYq09dj.kcxr3Z/39eoEUBegfCWKuMte1Y6mTzC', NULL, '2025-12-31 09:48:57', '2026-02-17 10:53:17', NULL, 1, '2026-02-11 10:50:52'),
('dc030a90-eabc-4957-9356-b48b31e16b88', 'Kabupaten Tangerang', 'kabtangerang@example.com', '$2b$10$qFRuM/qZYKvnGSWCfH5sTeI2cG/uEoe8nI2u409yRbMEIIEpgi1zK', NULL, '2026-02-26 10:53:13', '2026-02-26 10:56:43', NULL, 1, '2026-02-26 10:53:13'),
('e965b64d-62c0-478e-9924-086aa6dc8b93', 'Kota Serang', 'kotaserang@example.com', '$2b$10$K7uvaYyevjZIZWupBBbzSutZtFFfXyQivt5/q5YF4nQZeZ5bHgvBS', NULL, '2026-02-17 13:01:03', '2026-02-17 13:01:03', NULL, 1, '2026-02-11 10:50:52');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES
('57e58409-06a8-11f1-8db4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5'),
('72aa6fff-deef-4be9-82fc-9430ef0997de', '6089b3c2-b0cd-4f4b-99cf-5e50099b9671', 'a5400313-cded-11f0-8b76-00ff43fb69f5'),
('11192b44-fa13-415d-bb90-01ea53d3c7ad', '67a2798d-d7c6-4339-8521-b51125d4cdaf', 'a5400313-cded-11f0-8b76-00ff43fb69f5'),
('9dbe2154-3feb-4c76-897f-b4d3f3916007', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '817b8ba6-cdef-11f0-8b76-00ff43fb69f5'),
('57e58632-06a8-11f1-8db4-00ff43fb69f5', 'e965b64d-62c0-478e-9924-086aa6dc8b93', 'a5400313-cded-11f0-8b76-00ff43fb69f5');

-- --------------------------------------------------------

--
-- Table structure for table `user_territories`
--

CREATE TABLE `user_territories` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `territory_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_territories`
--

INSERT INTO `user_territories` (`id`, `user_id`, `territory_id`) VALUES
('634829ca-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '0a9dd655-445c-4dfe-9125-e2e144e0d2eb'),
('634838ee-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '220ff57f-982b-4470-ba16-782e33f343a2'),
('6348390c-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '2806586c-c214-48c7-be7f-6125c5c9fb89'),
('6348391f-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '337f56f8-f5d5-48c8-bc77-f47171afcdc2'),
('63483933-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '3e50734b-845c-447e-b4df-7f97ec0cac8b'),
('63483946-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '3ffeab77-4da5-4481-b41f-4a74038c9c87'),
('6348395e-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', '6092d03e-db96-46f7-a3bf-bd4ae1197dff'),
('63483975-08a8-11f1-91d4-00ff43fb69f5', '41527c0c-709b-4c62-9df2-e98416618c07', 'de6a4ff3-46de-459a-a405-e3de23fdf1e2'),
('70518a78-1e68-46da-aede-074cc8fdee72', '6089b3c2-b0cd-4f4b-99cf-5e50099b9671', '337f56f8-f5d5-48c8-bc77-f47171afcdc2'),
('b1f6eebc-dbb5-4a8e-9472-584d9cfdf6b4', '67a2798d-d7c6-4339-8521-b51125d4cdaf', '3e50734b-845c-447e-b4df-7f97ec0cac8b'),
('6e92a07e-08a8-11f1-91d4-00ff43fb69f5', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '0a9dd655-445c-4dfe-9125-e2e144e0d2eb'),
('b255ef70-9505-4a47-9aa1-09db9073c01b', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '220ff57f-982b-4470-ba16-782e33f343a2'),
('78c7d75e-733b-40e0-8b3c-4deafe31fcae', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '2806586c-c214-48c7-be7f-6125c5c9fb89'),
('f6a53ad2-0d47-4290-b78b-7352747cc01a', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '337f56f8-f5d5-48c8-bc77-f47171afcdc2'),
('865a6e45-8a75-49f6-b5df-f59484cdd29f', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '3e50734b-845c-447e-b4df-7f97ec0cac8b'),
('e5255e89-9b7b-45b4-aeef-58247ee998ad', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '3ffeab77-4da5-4481-b41f-4a74038c9c87'),
('8a142287-7745-4b4e-acd8-f1386b3e6f4e', '9524e9da-6b3b-42a0-8698-33e47bfb9073', '6092d03e-db96-46f7-a3bf-bd4ae1197dff'),
('5cdecbd2-dfbb-477a-a603-b01b2cdc13fd', '9524e9da-6b3b-42a0-8698-33e47bfb9073', 'de6a4ff3-46de-459a-a405-e3de23fdf1e2'),
('2e557d6f-c8ee-4e64-b20f-88bc9a7bc097', 'e965b64d-62c0-478e-9924-086aa6dc8b93', '3ffeab77-4da5-4481-b41f-4a74038c9c87');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `athletes`
--
ALTER TABLE `athletes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sport_id` (`sport_id`);

--
-- Indexes for table `coaches`
--
ALTER TABLE `coaches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `module_id` (`module_id`) USING BTREE;

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `officials`
--
ALTER TABLE `officials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nik` (`nik`) USING BTREE;

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `periods`
--
ALTER TABLE `periods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `period_athletes`
--
ALTER TABLE `period_athletes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_period_official` (`period_id`,`athlete_id`) USING BTREE,
  ADD KEY `territory_id` (`territory_id`) USING BTREE,
  ADD KEY `sport_id` (`sport_id`),
  ADD KEY `athlete_id` (`athlete_id`);

--
-- Indexes for table `period_categories`
--
ALTER TABLE `period_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_period_categories` (`period_id`,`category_id`) USING BTREE,
  ADD KEY `period_territory_sports_ibfk_5` (`category_id`);

--
-- Indexes for table `period_coaches`
--
ALTER TABLE `period_coaches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_period_official` (`period_id`,`coach_id`) USING BTREE,
  ADD KEY `territory_id` (`territory_id`) USING BTREE,
  ADD KEY `sport_id` (`sport_id`),
  ADD KEY `coach_id` (`coach_id`);

--
-- Indexes for table `period_officials`
--
ALTER TABLE `period_officials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_period_official` (`period_id`,`official_id`) USING BTREE,
  ADD KEY `territory_id` (`territory_id`) USING BTREE,
  ADD KEY `official_id` (`official_id`);

--
-- Indexes for table `period_sports`
--
ALTER TABLE `period_sports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_period_sport` (`period_id`,`sport_id`),
  ADD KEY `period_sports_ibfk_2` (`sport_id`);

--
-- Indexes for table `period_territories`
--
ALTER TABLE `period_territories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_periode_territory` (`period_id`,`territory_id`),
  ADD KEY `territory_id` (`territory_id`);

--
-- Indexes for table `period_territory_categories`
--
ALTER TABLE `period_territory_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_period_territory_category` (`period_id`,`territory_id`,`category_id`) USING BTREE,
  ADD KEY `territory_id` (`territory_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `period_territory_sports`
--
ALTER TABLE `period_territory_sports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pts` (`period_id`,`territory_id`,`sport_id`),
  ADD KEY `period_territory_sports_ibfk_4` (`territory_id`),
  ADD KEY `period_territory_sports_ibfk_5` (`sport_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permissions_ibfk_1` (`module_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `territories`
--
ALTER TABLE `territories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_role` (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_territories`
--
ALTER TABLE `user_territories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_territory` (`user_id`,`territory_id`) USING BTREE,
  ADD KEY `territory_id` (`territory_id`) USING BTREE;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`);

--
-- Constraints for table `otp`
--
ALTER TABLE `otp`
  ADD CONSTRAINT `otp_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `period_athletes`
--
ALTER TABLE `period_athletes`
  ADD CONSTRAINT `period_athletes_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_athletes_ibfk_2` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_athletes_ibfk_3` FOREIGN KEY (`athlete_id`) REFERENCES `athletes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_athletes_ibfk_4` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `period_coaches`
--
ALTER TABLE `period_coaches`
  ADD CONSTRAINT `period_coaches_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_coaches_ibfk_2` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_coaches_ibfk_3` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_coaches_ibfk_4` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `period_officials`
--
ALTER TABLE `period_officials`
  ADD CONSTRAINT `period_officials_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_officials_ibfk_2` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_officials_ibfk_3` FOREIGN KEY (`official_id`) REFERENCES `officials` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `period_sports`
--
ALTER TABLE `period_sports`
  ADD CONSTRAINT `period_sports_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`),
  ADD CONSTRAINT `period_sports_ibfk_2` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`);

--
-- Constraints for table `period_territories`
--
ALTER TABLE `period_territories`
  ADD CONSTRAINT `period_territories_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`),
  ADD CONSTRAINT `period_territories_ibfk_2` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`);

--
-- Constraints for table `period_territory_categories`
--
ALTER TABLE `period_territory_categories`
  ADD CONSTRAINT `period_territory_categories_ibfk_1` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_territory_categories_ibfk_2` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_territory_categories_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `period_territory_sports`
--
ALTER TABLE `period_territory_sports`
  ADD CONSTRAINT `period_territory_sports_ibfk_3` FOREIGN KEY (`period_id`) REFERENCES `periods` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_territory_sports_ibfk_4` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `period_territory_sports_ibfk_5` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_territories`
--
ALTER TABLE `user_territories`
  ADD CONSTRAINT `user_territories_ibfk_1` FOREIGN KEY (`territory_id`) REFERENCES `territories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_territories_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
