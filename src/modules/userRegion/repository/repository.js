import { db } from "../../../config/database.js";

const buildFilters = (search, user_id, region_id) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(users.name LIKE ? OR regions.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (user_id) {
    conditions.push(`users.id = ?`);
    params.push(user_id);
  }

  if (region_id) {
    conditions.push(`regions.id = ?`);
    params.push(region_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, user_id, region_id) => {
  let query = `
    SELECT user_regions.*, users.name AS user_name, regions.name AS region_name
    FROM user_regions
    JOIN users ON users.id = user_regions.user_id
    JOIN regions ON regions.id = user_regions.region_id
  `;

  const { conditions, params } = buildFilters(search, user_id, region_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += `ORDER BY users.name ASC, regions.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, user_id, region_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM user_regions
    JOIN users ON users.id = user_regions.user_id
    JOIN regions ON regions.id = user_regions.region_id
  `;

  const { conditions, params } = buildFilters(search, user_id, region_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const create = async (user_id, region_id) => {
  await db.query(
    "INSERT INTO user_regions (user_id, region_id) VALUES (?, ?)",
    [user_id, region_id]
  );
  return { user_id, region_id };
};

export const remove = async (user_id, region_id) => {
  await db.query("DELETE FROM user_regions WHERE user_id = ? AND region_id = ?", [user_id, region_id]);
};

export const checkRelations = async (user_id, region_id) => {
  const [rows] = await db.query(
    `SELECT * FROM user_regions WHERE user_id = ? AND region_id = ? LIMIT 1`,
    [user_id, region_id]
  );
  return rows[0];
};

export const getRelations = async (user_id) => {
  const [rows] = await db.query(`
    SELECT user_regions.*, regions.name AS region_name
    FROM user_regions
    JOIN regions ON regions.id = user_regions.region_id
    WHERE user_regions.user_id = ?
    ORDER BY regions.name ASC
    `, [user_id]
  );
  return rows;
};

export const insertMany = async (rows) => {
  if (rows.length === 0) return;
  await db.query(
    `
    INSERT INTO user_regions (user_id, region_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE user_id = user_id
    `,
    [rows]
  );
};

export const deleteMany = async (user_id, relations) => {
  if (!relations || relations.length === 0) {
    await db.query(
      `DELETE FROM user_regions WHERE user_id = ?`,
      [user_id]
    );
    return;
  }

  await db.query(
    `
    DELETE FROM user_regions
    WHERE user_id = ? AND region_id NOT IN (?)
    `,
    [user_id, relations]
  );
};