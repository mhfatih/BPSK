import { db } from "../../../config/database.js";

export const getAll = async (limit, offset, search) => {
  let query = `
    SELECT 
      p.*,
      m.name AS module_name
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
  `;

  const params = [];

  if (search) {
    query += ` 
    WHERE p.name LIKE ?
    OR m.name LIKE ? 
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` ORDER BY m.name ASC, p.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search) => {
  let query = `
    SELECT COUNT(*) as total
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
  `;

  const params = [];

  if (search) {
    query += ` 
    WHERE p.name LIKE ?
    OR m.name LIKE ? 
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getFull = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.*,
      m.name AS module_name
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
    ORDER BY m.name ASC, p.name ASC
  `,);

  return rows;
};

export const getByOwnerId = async (module_id) => {
  const [rows] = await db.query(`
    SELECT 
      p.*,
      m.name AS module_name
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
    WHERE m.id = ?
    ORDER BY m.name ASC, p.name ASC
  `, [module_id]);

  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      p.*,
      m.name AS module_name
    FROM permissions p
    JOIN modules m ON m.id = p.module_id
    WHERE p.id = ?
    LIMIT 1
  `, [id]);

  return rows[0];
};

export const create = async (id, module_id, name) => {
  await db.query(
    "INSERT INTO permissions (id, module_id, name) VALUES (?, ?, ?)",
    [id, module_id, name]
  );
  return { id, module_id, name };
};

export const update = async (id, name) => {
  await db.query(
    "UPDATE permissions SET name = ? WHERE id = ?",
    [name, id]
  );
  return { id, name };
};

export const remove = async (id) => {
  await db.query("DELETE FROM permissions WHERE id = ?", [id]);
};
