import * as service from "../service/service.js";

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const search = req.query.search || "";
    const result = await service.getAll(page, perPage, search, req.user);

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
    const { id: user_id } = req.user;
    const newData = await service.create(user_id);

    res.json({
      message: "Data berhasil dibuat",
      data: newData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const send = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await service.send(id, req.user);

    res.json({
      message: "Data berhasil diperbarui",
      data: updatedData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, registration_number, rejected_reason } = req.body;
    const updatedData = await service.verify(id, status, registration_number, rejected_reason, req.user);

    res.json({
      message: "Data berhasil diperbarui",
      data: updatedData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const process = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await service.process(id, req.user);

    res.json({
      message: "Data berhasil diperbarui",
      data: updatedData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const complete = async (req, res) => {
  try {
    const { id } = req.params;
    const { loss_amount } = req.body

    const files = {
      court_file: req.files?.court_file?.[0]?.path,
    };

    const updatedData = await service.complete(id, loss_amount, req.user, files);

    res.json({
      message: "Data berhasil diperbarui",
      data: updatedData,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { territory_id, name, description } = req.body;
    const updatedData = await service.update(id, territory_id, name, description, req.user);

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
