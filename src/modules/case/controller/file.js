import * as service from "../service/file.js";

export const view = async (req, res) => {
  try {
    const { id, field } = req.params;

    const data = await service.viewFile(id, field);

    res.sendFile(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};