import { db } from "../../../config/database.js";

const buildFilters = (search, case_id, user_id, regions) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(courts.name LIKE ?)`);
    params.push(`${search}`);
  }

  if (case_id) {
    conditions.push(`cases.id = ?`);
    params.push(case_id);
  }

  if (regions && regions.length > 0) {
    const placeholders = regions.map(() => "?").join(",");
    conditions.push(`(cases.user_id = ? OR territories.region_id IN (${placeholders}))`);
    params.push(user_id, ...regions);
  } else {
    conditions.push(`cases.user_id = ?`);
    params.push(user_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, case_id, user_id, regions) => {
  let query = `
    SELECT courts.*, cases.reporter_name AS case_name, territories.name AS territory_name
    FROM courts
    JOIN cases ON cases.id = courts.case_id
    JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, case_id, user_id, regions);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY courts.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, case_id, user_id, regions) => {
  let query = `
    SELECT COUNT(*) as total
    FROM courts
    JOIN cases ON cases.id = courts.case_id
    JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, case_id, user_id, regions);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [[rows]] = await db.query(`
    SELECT courts.*, cases.reporter_name as case_name, territories.name as territory_name, territories.region_id
    FROM courts 
    JOIN cases ON cases.id = courts.case_id
    JOIN territories ON territories.id = cases.territory_id
    WHERE courts.id = ?
    `, [id]);
  return rows;
};

export const create = async (id, case_id) => {
  await db.query(
    "INSERT INTO courts (id, case_id) VALUES (?, ?, ?, ?)",
    [id, case_id]
  );
  return { id, case_id };
};

export const schedule = async (id, date, time) => {
  await db.query(
    "UPDATE courts SET date = ?, time = ? WHERE id = ?",
    [date, time, id]
  );
  return { id, date, time };
};

export const result = async (id, settlement_method, court_result) => {
  await db.query(
    "UPDATE courts SET settlement_method = ?, court_result = ? WHERE id = ?",
    [settlement_method, court_result, id]
  );
  return { id, settlement_method, court_result };
};

export const remove = async (id) => {
  await db.query("DELETE FROM courts WHERE id = ?", [id]);
};
