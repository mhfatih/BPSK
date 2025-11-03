const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const kasusController = require('../controllers/kasusController');
const formController = require('../controllers/formController');
const sidangController = require('../controllers/sidangController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/upload');

// ==================== AUTH ====================
router.get("/check-token", authMiddleware, (req, res) => {
  res.json({ message: "Token valid" });
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.Profile.single('foto_identitas'), userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

// ==================== KASUS ====================
router.post('/kasus/kasus-add', authMiddleware, kasusController.createKasus);
router.get('/kasus', authMiddleware, kasusController.getAllKasus);
router.get('/kasus/:id', authMiddleware, kasusController.getKasusById);
router.put('/kasus/:id/submit-kasus', authMiddleware, kasusController.submitKasus);
router.put('/kasus/:id/verify-kasus', authMiddleware, kasusController.verifyKasus);
router.get('/kasus/:id/sidang', authMiddleware, sidangController.getSidangByKasusId);
router.post('/kasus/:id/sidang', authMiddleware, sidangController.createSidang);
router.put('/kasus/:sidangId/sidang', authMiddleware, sidangController.updateSidangById);

// ==================== FORM ====================
router.get('/kasus/:id/data-diri', authMiddleware, formController.getDataDiri);
router.put('/kasus/:id/data-diri', authMiddleware, upload.KasusDataDiri.single('foto_identitas'), formController.updateDataDiri);
router.get('/kasus/:id/pelaku-usaha', authMiddleware, formController.getPelakuUsaha);
router.put('/kasus/:id/pelaku-usaha', authMiddleware, formController.updatePelakuUsaha);
router.get('/kasus/:id/tentang-pengaduan', authMiddleware, formController.getTentangPengaduan);
router.put('/kasus/:id/tentang-pengaduan', authMiddleware, upload.KasusPengaduanBukti.single('foto_bukti'), formController.updateTentangPengaduan);
router.get('/kasus/:id/kronologis', authMiddleware, formController.getKronologis);
router.put('/kasus/:id/kronologis', authMiddleware, formController.updateKronologis);

// superadmin
router.get('/users', authMiddleware, roleCheck(['superadmin']), userController.getAllUsers);
router.get('/users/:id', authMiddleware, roleCheck(['superadmin']), userController.getUserById);
router.post('/users', authMiddleware, roleCheck(['superadmin']), userController.createUser);
router.put('/users/:id', authMiddleware, roleCheck(['superadmin']), userController.updateUser);
router.delete('/users/:id', authMiddleware, roleCheck(['superadmin']), userController.deleteUser);

module.exports = router;