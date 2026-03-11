import { db } from "../../../config/database.js";

export const getData = async (id) => {
  const [[rows]] = await db.query(`
    SELECT cases.id, cases.user_id, cases.territory_id, territories.region_id, territories.name as territory_name, cases.reporter_name, cases.reporter_age, cases.reporter_gender, cases.reporter_address, cases.reporter_email, cases.reporter_phone, cases.reporter_postal_code, cases.reporter_nik, cases.reporter_ktp_file, cases.reporter_contextual_file
    FROM cases 
    JOIN territories ON territories.id = cases.territory_id
    WHERE cases.id = ?
    `, [id]);
  return rows;
};

export const update = async (id, territory_id, reporter_name, reporter_age, reporter_gender, reporter_address, reporter_email, reporter_phone, reporter_postal_code, reporter_nik, reporter_ktp_file, reporter_contextual_file) => {
  await db.query(
    "UPDATE cases SET territory_id = ?, reporter_name = ?, reporter_age = ?, reporter_gender = ?, reporter_address = ?, reporter_email = ?, reporter_phone = ?, reporter_postal_code = ?, reporter_nik = ?, reporter_ktp_file = ?, reporter_contextual_file = ? WHERE id = ?",
    [territory_id, reporter_name, reporter_age, reporter_gender, reporter_address, reporter_email, reporter_phone, reporter_postal_code, reporter_nik, reporter_ktp_file, reporter_contextual_file, id]
  );
  return { id, territory_id, reporter_name, reporter_age, reporter_gender, reporter_address, reporter_email, reporter_phone, reporter_postal_code, reporter_nik, reporter_ktp_file, reporter_contextual_file };
};
