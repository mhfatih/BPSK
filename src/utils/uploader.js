const multer = require('multer');
const fs = require('fs');
const path = require('path');

/**
 * Fungsi upload universal
 * @param {string} subfolder - Subfolder penyimpanan file
 * @param {string} filenamePrefix - Prefix nama file
 * @param {Object} options - Opsi tambahan (opsional)
 *   { number } options.maxSize - Batas ukuran file (byte), default 5MB
 *   { string[] } options.allowedTypes - MIME types yang diizinkan
 */
function uploader(subfolder, filenamePrefix = 'file', options = {}) {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // default: 5MB
  const allowedTypes = options.allowedTypes || [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads', subfolder);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `${filenamePrefix}_${timestamp}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Jenis file tidak diizinkan'), false);
    }
    cb(null, true);
  };

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  });
}

/**
 * Fungsi untuk menghapus file lama
 */
function deleteOldFile(filePath) {
  if (!filePath) return;

  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`🧹 File lama dihapus: ${fullPath}`);
    } catch (err) {
      console.error('⚠️ Gagal hapus file lama:', err);
    }
  }
}

module.exports = { uploader, deleteOldFile };
