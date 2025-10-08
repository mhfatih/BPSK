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

const Profile = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    return path.join(__dirname, '..', 'uploads', userId, 'profile');
  },
  (req, file) => 'identitas' + path.extname(file.originalname)
);

const KasusDataDiri = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    const kasusId = req.params.id;
    return path.join(__dirname, '..', 'uploads', userId, 'kasus', kasusId);
  },
  (req, file) => 'identitas' + path.extname(file.originalname)
);

const KasusBukti = createUploader(
  (req) => {
    const userId = req.user?.id || 'unknown_user';
    const kasusId = req.params.id;
    return path.join(__dirname, '..', 'uploads', userId, 'kasus', kasusId);
  },
  (req, file) => {
    // Tentukan prefix nama file berdasarkan fieldname
    let prefix = 'bukti';
    if (file.fieldname === 'foto_bukti_pembelian') prefix = 'bukti_pembelian';
    else if (file.fieldname === 'foto_barang_bukti') prefix = 'barang_bukti';

    // Hitung urutan file di setiap field
    if (!req._fileCount) req._fileCount = {};
    req._fileCount[file.fieldname] = (req._fileCount[file.fieldname] || 0) + 1;

    const nomor = req._fileCount[file.fieldname]; // urutan ke-1, ke-2, dst

    // 🔥 Tambahkan timestamp biar unik
    const timestamp = Date.now();

    // nama akhir → bukti_pembelian_1_1696860987780.jpg
    return `${prefix}_${nomor}_${timestamp}${path.extname(file.originalname)}`;
  }
);

module.exports = {
  createUploader,
  Profile,
  KasusDataDiri,
  KasusBukti
};
