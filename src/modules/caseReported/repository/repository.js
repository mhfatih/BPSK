import { db } from "../../../config/database.js";

const buildFilters = (search, user_id, regions) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(courts.name LIKE ?)`);
    params.push(`%${search}%`);
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

export const getAll = async (limit, offset, search, user_id, regions) => {
  let query = `
    SELECT courts.*, cases.reporter_name AS case_name, territories.name AS territory_name
    FROM courts
    JOIN cases ON cases.id = courts.case_id
    JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, user_id, regions);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY courts.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, user_id, regions) => {
  let query = `
    SELECT COUNT(*) as total
    FROM courts
    JOIN cases ON cases.id = courts.case_id
    JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, user_id, regions);

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

export const create = async (id, case_id, name, description) => {
  await db.query(
    "INSERT INTO courts (id, case_id, name, description) VALUES (?, ?, ?, ?)",
    [id, case_id, name, description]
  );
  return { id, case_id, name, description };
};

export const update = async (id, name, description) => {
  await db.query(
    "UPDATE courts SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
  return { id, name, description };
};

export const remove = async (id) => {
  await db.query("DELETE FROM courts WHERE id = ?", [id]);
};
