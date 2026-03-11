import { db } from "../../../config/database.js";

const buildFilters = (search, user_id, role_id) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(users.name LIKE ? OR roles.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (user_id) {
    conditions.push(`users.id = ?`);
    params.push(user_id);
  }

  if (role_id) {
    conditions.push(`roles.id = ?`);
    params.push(role_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, user_id, role_id) => {
  let query = `
    SELECT user_roles.*, users.name AS user_name, roles.name AS role_name
    FROM user_roles
    JOIN users ON users.id = user_roles.user_id
    JOIN roles ON roles.id = user_roles.role_id
  `;

  const { conditions, params } = buildFilters(search, user_id, role_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += `ORDER BY users.name ASC, roles.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, user_id, role_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM user_roles
    JOIN users ON users.id = user_roles.user_id
    JOIN roles ON roles.id = user_roles.role_id
  `;

  const { conditions, params } = buildFilters(search, user_id, role_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const create = async (user_id, role_id) => {
  await db.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
    [user_id, role_id]
  );
  return { user_id, role_id };
};

export const remove = async (user_id, role_id) => {
  await db.query("DELETE FROM user_roles WHERE user_id = ? AND role_id = ?", [user_id, role_id]);
};

export const checkRelations = async (user_id, role_id) => {
  const [rows] = await db.query(
    `SELECT * FROM user_roles WHERE user_id = ? AND role_id = ? LIMIT 1`,
    [user_id, role_id]
  );
  return rows[0];
};

export const getRelations = async (user_id) => {
  const [rows] = await db.query(`
    SELECT user_roles.*, roles.name AS role_name
    FROM user_roles
    JOIN roles ON roles.id = user_roles.role_id
    WHERE user_roles.user_id = ?
    ORDER BY roles.name ASC
    `, [user_id]
  );
  return rows;
};

export const insertMany = async (rows) => {
  if (rows.length === 0) return;
  await db.query(
    `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE user_id = user_id
    `,
    [rows]
  );
};

export const deleteMany = async (user_id, relations) => {
  if (!relations || relations.length === 0) {
    await db.query(
      `DELETE FROM user_roles WHERE user_id = ?`,
      [user_id]
    );
    return;
  }

  await db.query(
    `
    DELETE FROM user_roles
    WHERE user_id = ? AND role_id NOT IN (?)
    `,
    [user_id, relations]
  );
};