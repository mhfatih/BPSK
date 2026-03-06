import * as service from "../service/service.js";

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const search = req.query.search || "";

    const result = await service.getAll(page, perPage, search);

    res.json({
      status: 200,
      success: true,
      message: "Sukses",
      ...result
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getFull = async (req, res) => {
  try {
    const data = await service.getFull();

    res.json({
      status: 200,
      success: true,
      message: "Sukses",
      data: data,
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
      status: 200,
      success: true,
      message: "Sukses",
      data: data,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const { module_id, name } = req.body;

    const newData = await service.create(module_id, name);

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
    const { name } = req.body;

    const updatedData = await service.update(
      id,
      name
    );

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
