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
    const { name, email, password } = req.body;

    const newData = await service.create(name, email, password);

    res.json({
      message: "User berhasil dibuat",
      data: newData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updatedData = await service.update(id, name, email, password);

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

    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await service.getProfile(req.user.id);

    const fileUrl = user.profile_picture

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profile_picture_url: fileUrl
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    const name = req.body.name || null;

    if (!file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const result = await service.updateProfile(userId, file, name);

    return res.status(200).json({
      message: "Profile berhasil diperbarui",
      data: result
    });

  } catch (error) {
    console.error("Error upload profile:", error);
    res.status(500).json({ message: error.message });
  }
};