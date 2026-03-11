import * as repo from "../repository/file.js";
import path from "path";
import fs from "fs";

export const uploadPath = async (req, res, next) => {
  const { id } = req.params;
  req.uploadPath = `uploads/private/cases/${id}`;
  next();
};

export const viewFile = async (id, field) => {
  const allowedFields = [
    "reporter_ktp_file",
    "reporter_contextual_file",
    "complaint_receipt_file",
    "court_file"
  ];

  if (!allowedFields.includes(field)) {
    throw new Error("Field tidak valid");
  }

  const data = await repo.getFile(id);
  if (!data) throw new Error("Data tidak ditemukan");

  const filePath = data[field];
  if (!filePath) throw new Error("File tidak ada");

  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error("File tidak ditemukan di server");
  }

  return absolutePath;
};