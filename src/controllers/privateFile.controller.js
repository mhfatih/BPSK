import { resolvePrivateFile } from "../utils/privateFile.util.js";

export const getPrivateFile = (req, res) => {
  try {
    const relativePath = req.params[0];

    const filePath = resolvePrivateFile(relativePath);
    return res.sendFile(filePath);
  } catch (err) {
    return res.status(403).json({
      message: err.message,
    });
  }
};
