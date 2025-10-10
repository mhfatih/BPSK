const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const kasusController = require('../controllers/kasusController');
const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');

// ==================== AUTH ====================
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.Profile.single('foto_identitas'), userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

// ==================== KASUS ====================
router.post('/kasus/kasus-add', authMiddleware, kasusController.createKasus);
router.put('/kasus/:id/data-diri-update', authMiddleware, upload.KasusDataDiri.single('foto_identitas'), kasusController.updateDataDiri);
router.put('/kasus/:id/pelaku-usaha-update', authMiddleware, kasusController.updatePelakuUsaha);
router.put('/kasus/:id/tentang-pengaduan-update', authMiddleware, upload.KasusPengaduanBukti.single('foto_bukti'), kasusController.updateTentangPengaduan);
router.put('/kasus/:id/kronologis-update', authMiddleware, kasusController.updateKronologis);
router.put('/kasus/:id/submit-kasus', authMiddleware, kasusController.submitKasus);
router.put('/kasus/:id/verify-kasus', authMiddleware, kasusController.verifyKasus);
router.get('/kasus', authMiddleware, kasusController.getAllKasus);
router.get('/kasus/:id', authMiddleware, kasusController.getKasusById);
router.get('/kasus/:id/sidang-update', authMiddleware, kasusController.getKasusById);

// superadmin
router.get('/users', roleCheck(['superadmin']), userController.getAllUsers);
router.get('/users/:id', roleCheck(['superadmin']), userController.getUserById);
router.post('/users', roleCheck(['superadmin']), userController.createUser);
router.put('/users/:id', roleCheck(['superadmin']), userController.updateUser);
router.delete('/users/:id', roleCheck(['superadmin']), userController.deleteUser);

module.exports = router;
