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
        const { territory_id, reporter_name, reporter_age, reporter_gender, reporter_address, reporter_email, reporter_phone, reporter_postal_code, reporter_nik } = req.body;

        const files = {
            reporter_ktp_file: req.files?.reporter_ktp_file?.[0]?.path,
            reporter_contextual_file: req.files?.reporter_contextual_file?.[0]?.path,
        };

        const updatedData = await service.update(id, territory_id, reporter_name, reporter_age, reporter_gender, reporter_address, reporter_email, reporter_phone, reporter_postal_code, reporter_nik, req.user, files);

        res.json({
            message: "Data berhasil diperbarui",
            data: updatedData,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
