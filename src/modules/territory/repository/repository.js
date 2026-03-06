import { db } from "../../../config/database.js";

const buildFilters = (search, area_id) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(t.name LIKE ? OR a.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (area_id) {
    conditions.push(`t.area_id = ?`);
    params.push(area_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, area_id) => {
  let query = `
    SELECT t.*, a.name AS area_name
    FROM territories t
    JOIN areas a ON a.id = t.area_id
  `;
  
  const { conditions, params } = buildFilters(search, area_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY t.name ASC, a.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, area_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM territories t
    JOIN areas a ON a.id = t.area_id
  `;

  const { conditions, params } = buildFilters(search, area_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM territories WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (id, area_id, name, description) => {
  await db.query(
    "INSERT INTO territories (id, area_id, name, description) VALUES (?, ?, ?, ?)",
    [id, area_id, name, description]
  );
  return { id, area_id, name, description };
};

export const update = async (id, name, description) => {
  await db.query(
    "UPDATE territories SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
  return { id, name, description };
};

export const remove = async (id) => {
  await db.query("DELETE FROM territories WHERE id = ?", [id]);
};
