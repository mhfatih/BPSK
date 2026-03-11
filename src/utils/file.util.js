import fs from "fs";

export const deleteFile = (path) => {
  if (!path) return;

  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (err) {
    console.error("Failed to delete file:", err.message);
  }
};

export const replaceFile = (oldFile, newFile) => {
  if (newFile && oldFile && newFile !== oldFile) {
    deleteFile(oldFile);
  }

  return newFile ?? oldFile;
};