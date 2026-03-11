import { db } from "../../../config/database.js";

export const getFile = async (id) => {
  const [[rows]] = await db.query(`
    SELECT cases.id, cases.user_id, cases.territory_id, territories.region_id, cases.reporter_ktp_file, cases.reporter_contextual_file, cases.complaint_receipt_file
    FROM cases 
    JOIN territories ON territories.id = cases.territory_id
    WHERE cases.id = ?
    `, [id]);
  return rows;
};

export const updateFile = async (id, reporter_ktp_file, reporter_contextual_file, complaint_receipt_file) => {
  await db.query(
    "UPDATE cases SET reporter_ktp_file = ?, reporter_contextual_file = ?, complaint_receipt_file = ? WHERE id = ?",
    [reporter_ktp_file, reporter_contextual_file, complaint_receipt_file, id]
  );
  return { id, reporter_ktp_file, reporter_contextual_file, complaint_receipt_file };
};