import fs from "fs";

export const deleteFileIfExists = (filePath) => {
  if (!filePath) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
