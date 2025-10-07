const multer = require('multer');
const fs = require('fs');
const path = require('path');

/**
 * Fungsi untuk bikin konfigurasi multer dinamis
 * @param {Function} getUploadPath - Fungsi yang menerima (req, file) dan return path tujuan upload
 * @param {Function} getFilename - (opsional) Fungsi untuk menentukan nama file
 */
function createUploader(getUploadPath, getFilename) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = getUploadPath(req, file);

      // buat folder-nya kalau belum ada
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = getFilename
        ? getFilename(req, file)
        : file.originalname; // default: pakai nama asli
      cb(null, filename);
    }
  });

  return multer({ storage });
}

/**
 * Contoh preset siap pakai
 */
const uploadProfile = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    return path.join(__dirname, '..', 'uploads', userId, 'profile');
  },
  (req, file) => 'identitas' + path.extname(file.originalname)
);

const uploadKasusDataDiri = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    const kasusId = req.params.id;
    return path.join(__dirname, '..', 'uploads', userId, 'kasus', kasusId);
  },
  (req, file) => 'identitas' + path.extname(file.originalname)
);

module.exports = {
  createUploader,
  uploadProfile,
  uploadKasusDataDiri
};
