const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const userController = require('../controllers/userController');
const kasusController = require('../controllers/kasusController');
const dataDiriController = require('../controllers/dataDiriController');
const pelakuUsahaController = require('../controllers/pelakuUsahaController');
const tentangPengaduanController = require('../controllers/tentangPengaduanController');
const kronologisController = require('../controllers/kronologisController');
const sidangController = require('../controllers/sidangController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleMiddleware');

// ==================== AUTH ====================
router.get("/check-token", authMiddleware, (req, res) => {
  res.json({ message: "Token valid" });
});
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/change-password', authMiddleware, authController.changePassword);
router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, profileController.updateProfile);

// ==================== KASUS ====================
router.get('/dashboard', authMiddleware, kasusController.getDashboard);
router.post('/kasus/kasus-add', authMiddleware, kasusController.createKasus);
router.get('/kasus', authMiddleware, kasusController.getAllKasus);
router.get('/kasus/:id', authMiddleware, kasusController.getKasusById);
router.put('/kasus/:id/submit', authMiddleware, kasusController.submitKasus);
router.put('/kasus/:id/verify', authMiddleware, kasusController.verifyKasus);
router.put('/kasus/:id/proses', authMiddleware, kasusController.prosesKasus);
router.put('/kasus/:id/selesai', authMiddleware, kasusController.selesaiKasus);

// ==================== DATA-DIRI ====================
router.get('/kasus/:id/data-diri', authMiddleware, dataDiriController.getDataDiri);
router.put('/kasus/:id/data-diri', authMiddleware, dataDiriController.updateDataDiri);

// ==================== PELAKU-USAHA ====================
router.get('/kasus/:id/pelaku-usaha', authMiddleware, pelakuUsahaController.getPelakuUsahaByKasus);
router.post('/kasus/:id/pelaku-usaha', authMiddleware, pelakuUsahaController.createPelakuUsaha);
router.get('/pelaku-usaha/:id', authMiddleware, pelakuUsahaController.getPelakuUsahaById);
router.put('/pelaku-usaha/:id', authMiddleware, pelakuUsahaController.updatePelakuUsahaById);
router.delete('/pelaku-usaha/:id', authMiddleware, pelakuUsahaController.deletePelakuUsahaById);

// ==================== TENTANG-PENGADUAN ====================
router.get('/kasus/:id/tentang-pengaduan', authMiddleware, tentangPengaduanController.getTentangPengaduan);
router.put('/kasus/:id/tentang-pengaduan', authMiddleware, tentangPengaduanController.updateTentangPengaduan);

// ==================== KRONOLOGIS ====================
router.get('/kasus/:id/kronologis', authMiddleware, kronologisController.getKronologis);
router.put('/kasus/:id/kronologis', authMiddleware, kronologisController.updateKronologis);

// ==================== SIDANG ====================
router.get('/sidang', authMiddleware, sidangController.getAllSidang);
router.get('/kasus/:id/sidang', authMiddleware, sidangController.getSidangByKasusId);
router.get('/sidang/:id', authMiddleware, sidangController.getSidangById);
router.post('/kasus/:id/sidang', authMiddleware, sidangController.createSidang);
router.put('/sidang/:id/jadwal', authMiddleware, sidangController.updateJadwalSidang);
router.put('/sidang/:id/hasil', authMiddleware, sidangController.updateHasilSidang);
router.delete('/sidang/:id', authMiddleware, sidangController.deleteSidang);

// superadmin
router.get('/users', authMiddleware, roleCheck(['superadmin']), userController.getAllUsers);
router.get('/users/:id', authMiddleware, roleCheck(['superadmin']), userController.getUserById);
router.post('/users', authMiddleware, roleCheck(['superadmin']), userController.createUser);
router.put('/users/:id', authMiddleware, roleCheck(['superadmin']), userController.updateUser);
router.delete('/users/:id', authMiddleware, roleCheck(['superadmin']), userController.deleteUser);

module.exports = router;