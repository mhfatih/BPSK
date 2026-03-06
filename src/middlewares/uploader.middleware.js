import multer from "multer";
import fs from "fs";
import path from "path";
import { toKebabCase } from "../utils/string.util.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadPath = req.uploadPath;

      if (!uploadPath || typeof uploadPath !== "string") {
        return cb(new Error("Upload path belum ditentukan"));
      }

      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fieldName = toKebabCase(file.fieldname);
    cb(null, `${Date.now()}-${fieldName}${ext}`);
  },
});

export const uploader = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Format file tidak diizinkan"), false);
    }
    cb(null, true);
  },
});
