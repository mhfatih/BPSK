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
        const { complaint_type, complaint_date, complaint_time, complaint_location, complaint_loss, complaint_statement, complaint_receipt, complaint_witness, complaint_witness_relation, complaint_evidence } = req.body;

        const files = {
            complaint_receipt_file: req.files?.complaint_receipt_file?.[0]?.path,
        };

        const updatedData = await service.update(id, complaint_type, complaint_date, complaint_time, complaint_location, complaint_loss, complaint_statement, complaint_receipt, complaint_witness, complaint_witness_relation, complaint_evidence, req.user, files);

        res.json({
            message: "Data berhasil diperbarui",
            data: updatedData,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
