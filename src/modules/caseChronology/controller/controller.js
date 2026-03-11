import * as service from "../service/service.js";

export const getData = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await service.getData(id, req.user);

        res.json({
            message: "Berhasil mengambil data",
            data: data,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { chronology, demand_type } = req.body;
        const updatedData = await service.update(id, chronology, demand_type, req.user);

        res.json({
            message: "Data berhasil diperbarui",
            data: updatedData,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
