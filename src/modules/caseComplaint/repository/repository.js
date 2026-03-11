import { db } from "../../../config/database.js";

export const getData = async (id) => {
  const [[rows]] = await db.query(`
    SELECT cases.id, cases.user_id, cases.territory_id, territories.region_id, cases.complaint_type, cases.complaint_date, cases.complaint_time, cases.complaint_location, cases.complaint_loss, cases.complaint_statement, cases.complaint_receipt, cases.complaint_witness, cases.complaint_witness_relation, cases.complaint_evidence, cases.complaint_receipt_file
    FROM cases 
    JOIN territories ON territories.id = cases.territory_id
    WHERE cases.id = ?
    `, [id]);
  return rows;
};

export const update = async (id, complaint_type, complaint_date, complaint_time, complaint_location, complaint_loss, complaint_statement, complaint_receipt, complaint_witness, complaint_witness_relation, complaint_evidence, complaint_receipt_file) => {
  await db.query(
    "UPDATE cases SET complaint_type = ?, complaint_date = ?, complaint_time = ?, complaint_location = ?, complaint_loss = ?, complaint_statement = ?, complaint_receipt = ?, complaint_witness = ?, complaint_witness_relation = ?, complaint_evidence = ?, complaint_receipt_file = ? WHERE id = ?",
    [complaint_type, complaint_date, complaint_time, complaint_location, complaint_loss, complaint_statement, complaint_receipt, complaint_witness, complaint_witness_relation, complaint_evidence, complaint_receipt_file, id]
  );
  return { id, complaint_type, complaint_date, complaint_time, complaint_location, complaint_loss, complaint_statement, complaint_receipt, complaint_witness, complaint_witness_relation, complaint_evidence, complaint_receipt_file };
};
