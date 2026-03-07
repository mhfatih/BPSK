import path from "path";
import fs from "fs";

export const resolvePrivateFile = (relativePath) => {
  const basePath = path.join(process.cwd(), "uploads/private");
  const filePath = path.join(basePath, relativePath);

  if (!filePath.startsWith(basePath)) {
    throw new Error("Forbidden path");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  return filePath;
};
