import { db } from "../../../config/database.js";

const buildFilters = (search, role_id, permission_id) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(roles.name LIKE ? OR permissions.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (role_id) {
    conditions.push(`roles.id = ?`);
    params.push(role_id);
  }

  if (permission_id) {
    conditions.push(`permissions.id = ?`);
    params.push(permission_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, role_id, permission_id) => {
  let query = `
    SELECT role_permissions.*, roles.name AS role_name, permissions.name AS permission_name
    FROM role_permissions
    JOIN roles ON roles.id = role_permissions.role_id
    JOIN permissions ON permissions.id = role_permissions.permission_id
  `;

  const { conditions, params } = buildFilters(search, role_id, permission_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += `ORDER BY roles.name ASC, permissions.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, role_id, permission_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM role_permissions
    JOIN roles ON roles.id = role_permissions.role_id
    JOIN permissions ON permissions.id = role_permissions.permission_id
  `;

  const { conditions, params } = buildFilters(search, role_id, permission_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const create = async (role_id, permission_id) => {
  await db.query(
    "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
    [role_id, permission_id]
  );
  return { role_id, permission_id };
};

export const remove = async (role_id, permission_id) => {
  await db.query("DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?", [role_id, permission_id]);
};

export const checkRelations = async (role_id, permission_id) => {
  const [rows] = await db.query(
    `SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ? LIMIT 1`,
    [role_id, permission_id]
  );
  return rows[0];
};

export const getRelations = async (role_id) => {
  const [rows] = await db.query(`
    SELECT role_permissions.*, permissions.name AS permission_name
    FROM role_permissions
    JOIN permissions ON permissions.id = role_permissions.permission_id
    WHERE role_permissions.role_id = ?
    ORDER BY permissions.name ASC
    `, [role_id]
  );
  return rows;
};

export const insertMany = async (rows) => {
  if (rows.length === 0) return;
  await db.query(
    `
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE role_id = role_id
    `,
    [rows]
  );
};

export const deleteMany = async (role_id, relations) => {
  if (!relations || relations.length === 0) {
    await db.query(
      `DELETE FROM role_permissions WHERE role_id = ?`,
      [role_id]
    );
    return;
  }

  await db.query(
    `
    DELETE FROM role_permissions
    WHERE role_id = ? AND permission_id NOT IN (?)
    `,
    [role_id, relations]
  );
};