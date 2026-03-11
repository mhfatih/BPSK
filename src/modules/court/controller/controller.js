import * as service from "../service/service.js";

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const search = req.query.search || "";
    const case_id = req.query.case_id || "";
    const result = await service.getAll(page, perPage, search, case_id, req.user);

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

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.getById(id, req.user);

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
    const { case_id } = req.body;
    const newData = await service.create(case_id, req.user);

    res.json({
      message: "Data berhasil dibuat",
      data: newData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const schedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    const updatedData = await service.schedule(id, date, time, req.user);

    res.json({
      message: "Data berhasil diperbarui",
      data: updatedData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const result = async (req, res) => {
  try {
    const { id } = req.params;
    const { settlement_method, court_result } = req.body;
    const updatedData = await service.result(id, settlement_method, court_result, req.user);

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
    await service.remove(id, req.user);

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
