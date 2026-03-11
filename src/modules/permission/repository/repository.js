import { db } from "../../../config/database.js";

const buildFilters = (search, module_id) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(permissions.name LIKE ? OR modules.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (module_id) {
    conditions.push(`permissions.module_id = ?`);
    params.push(module_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, module_id) => {
  let query = `
    SELECT permissions.*, modules.name AS module_name
    FROM permissions
    JOIN modules ON modules.id = permissions.module_id
  `;
  
  const { conditions, params } = buildFilters(search, module_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY permissions.name ASC, modules.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, module_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM permissions
    JOIN modules ON modules.id = permissions.module_id
  `;

  const { conditions, params } = buildFilters(search, module_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getFull = async () => {
  const [rows] = await db.query(`
    SELECT 
      permissions.*,
      modules.name AS module_name
    FROM permissions
    JOIN modules ON modules.id = permissions.module_id
    ORDER BY modules.name ASC, permissions.name ASC
  `,);

  return rows;
};

export const getByOwnerId = async (module_id) => {
  const [rows] = await db.query(`
    SELECT 
      permissions.*,
      modules.name AS module_name
    FROM permissions
    JOIN modules ON modules.id = permissions.module_id
    WHERE modules.id = ?
    ORDER BY modules.name ASC, permissions.name ASC
  `, [module_id]);

  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      permissions.*,
      modules.name AS module_name
    FROM permissions
    JOIN modules ON modules.id = permissions.module_id
    WHERE permissions.id = ?
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
