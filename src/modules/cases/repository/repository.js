import { db } from "../../../config/database.js";

const buildFilters = (search) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(m.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search) => {
  let query = `
    SELECT * 
    FROM modules m
  `;

  const { conditions, params } = buildFilters(search);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY m.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search) => {
  let query = `SELECT COUNT(*) as total FROM modules m`;

  const { conditions, params } = buildFilters(search);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM modules WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (id, name, description) => {
  await db.query(
    "INSERT INTO modules (id, name, description) VALUES (?, ?, ?)",
    [id, name, description]
  );
  return { id, name, description };
};

export const update = async (id, name, description) => {
  await db.query(
    "UPDATE modules SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
  return { id, name, description };
};

export const remove = async (id) => {
  await db.query("DELETE FROM modules WHERE id = ?", [id]);
};
