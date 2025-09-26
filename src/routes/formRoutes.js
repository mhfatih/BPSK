const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

// Routes form bertahap
router.post('/step1', formController.step1DataDiri);         // bikin form baru
router.post('/:id/step2', formController.step2PelakuUsaha); // update data pelaku usaha
router.post('/:id/step3', formController.step3Pengaduan);   // update pengaduan
router.post('/:id/step4', formController.step4Kronologis);  // update kronologis

// Ambil semua form
router.get('/', formController.getAllForms);

// Ambil form by id
router.get('/:id', formController.getFormById);

module.exports = router;
