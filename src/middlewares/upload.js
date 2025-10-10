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
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = getFilename
        ? getFilename(req, file)
        : file.originalname;
      cb(null, filename);
    }
  });

  return multer({ storage });
}

/**
 * 📁 Upload foto profil user
 * path: /uploads/<userId>/profile/identitas.jpg
 */
const Profile = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    return path.join(__dirname, '..', 'uploads', userId, 'profile');
  },
  (req, file) => 'identitas' + path.extname(file.originalname)
);

/**
 * 📁 Upload data diri untuk kasus (jika masih digunakan di fitur lain)
 * path: /uploads/<userId>/kasus/<kasusId>/identitas.jpg
 */
const KasusDataDiri = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    const kasusId = req.params.id;
    return path.join(__dirname, '..', 'uploads', userId, 'kasus', kasusId);
  },
  (req, file) => 'identitas' + path.extname(file.originalname)
);

/**
 * 📁 Upload bukti utama untuk kasus_pengaduan
 * path: /uploads/<userId>/kasus/<kasusId>/foto_bukti_timestamp.jpg
 */
const KasusPengaduanBukti = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    const kasusId = req.params.id;
    return path.join(__dirname, '..', 'uploads', userId, 'kasus', kasusId);
  },
  (req, file) => {
    const timestamp = Date.now();
    return `foto_bukti_${timestamp}${path.extname(file.originalname)}`;
  }
);

module.exports = {
  createUploader,
  Profile,
  KasusDataDiri,
  KasusPengaduanBukti
};
