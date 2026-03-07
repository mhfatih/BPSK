import { db } from "../../../config/database.js";

const buildFilters = (search, user_id, territory_id) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(u.name LIKE ? OR t.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (user_id) {
    conditions.push(`u.id = ?`);
    params.push(user_id);
  }

  if (territory_id) {
    conditions.push(`t.id = ?`);
    params.push(territory_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, user_id, territory_id) => {
  let query = `
    SELECT 
      ut.*,
      u.name AS user_name,
      t.name AS territory_name
    FROM user_territories ut
    JOIN users u ON u.id = ut.user_id
    JOIN territories t ON t.id = ut.territory_id
  `;

  const { conditions, params } = buildFilters(search, user_id, territory_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += `ORDER BY u.name ASC, t.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, user_id, territory_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM user_territories ut
    JOIN users u ON u.id = ut.user_id
    JOIN territories t ON t.id = ut.territory_id
  `;

  const { conditions, params } = buildFilters(search, user_id, territory_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const create = async (user_id, territory_id) => {
  await db.query(
    "INSERT INTO user_territories (user_id, territory_id) VALUES (?, ?)",
    [user_id, territory_id]
  );
  return { user_id, territory_id };
};

export const remove = async (user_id, territory_id) => {
  await db.query("DELETE FROM user_territories WHERE user_id = ? AND territory_id = ?", [user_id, territory_id]);
};

export const checkRelations = async (user_id, territory_id) => {
  const [rows] = await db.query(
    `SELECT * FROM user_territories WHERE user_id = ? AND territory_id = ? LIMIT 1`,
    [user_id, territory_id]
  );
  return rows[0];
};

export const getRelations = async (user_id) => {
  const [rows] = await db.query(`
    SELECT ut.*, t.name AS territory_name
    FROM user_territories ut
    JOIN territories t ON t.id = ut.territory_id
    WHERE ut.user_id = ?
    ORDER BY t.name ASC
    `, [user_id]
  );
  return rows;
};

export const insertMany = async (rows) => {
  if (rows.length === 0) return;
  await db.query(
    `
    INSERT INTO user_territories (user_id, territory_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE user_id = user_id
    `,
    [rows]
  );
};

export const deleteMany = async (user_id, relations) => {
  if (!relations || relations.length === 0) {
    await db.query(
      `DELETE FROM user_territories WHERE user_id = ?`,
      [user_id]
    );
    return;
  }

  await db.query(
    `
    DELETE FROM user_territories
    WHERE user_id = ? AND territory_id NOT IN (?)
    `,
    [user_id, relations]
  );
};