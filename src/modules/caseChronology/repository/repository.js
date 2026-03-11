import { db } from "../../../config/database.js";

export const getData = async (id) => {
  const [[rows]] = await db.query(`
    SELECT cases.id, cases.user_id, cases.territory_id, territories.region_id, cases.chronology, cases.demand_type
    FROM cases 
    JOIN territories ON territories.id = cases.territory_id
    WHERE cases.id = ?
    `, [id]);
  return rows;
};

export const update = async (id, chronology, demand_type) => {
  await db.query(
    "UPDATE cases SET chronology = ?, demand_type = ? WHERE id = ?",
    [chronology, demand_type, id]
  );
  return { id, chronology, demand_type };
};
