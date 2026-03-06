import * as service from "../service/service.js";

export const getAll = async (req, res) => {
  try {
    const data = await service.getAll();

    res.json({
      status: 200,
      success: true,
      message: "Sukses",
      data: data
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.getById(id);

    res.json({
      message: "Berhasil mengambil data",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const { module_id, parent_id, sort_order } = req.body;

    const newData = await service.create(module_id, parent_id, sort_order);

    res.json({
      message: "Data berhasil dibuat",
      data: newData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { parent_id, sort_order } = req.body;

    const updatedData = await service.update(id, parent_id, sort_order);

    res.json({
      message: "Data berhasil diperbarui",
      data: updatedData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await service.remove(id);

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
