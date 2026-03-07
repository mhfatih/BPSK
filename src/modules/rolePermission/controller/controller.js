import * as service from "../service/service.js";

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const search = req.query.search || "";
    const role_id = req.query.role_id || "";
    const permission_id = req.query.permission_id || "";
    const result = await service.getAll(page, perPage, search, role_id, permission_id);

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

export const create = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    const newData = await service.create(role_id, permission_id);

    res.json({
      message: "Data berhasil dibuat",
      data: newData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { role_id, permission_id } = req.params;
    await service.remove(role_id, permission_id);

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRelations = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.getRelations(id);

    res.json({ data: data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const assignRelations = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { items } = req.body;
    const data = await service.assignRelations(role_id, items);

    res.json({
      message: "Data berhasil diperbarui",
      data: data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};