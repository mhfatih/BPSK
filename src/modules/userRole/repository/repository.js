import { db } from "../../../config/database.js";

export const getAll = async (limit, offset, search) => {
  let query = `
    SELECT 
      ur.*,
      u.name AS user_name,
      r.name AS role_name
    FROM user_roles ur
    JOIN users u ON u.id = ur.user_id
    JOIN roles r ON r.id = ur.role_id
  `;

  const params = [];

  if (search) {
    query += `
      WHERE u.name LIKE ?
      OR r.name LIKE ?
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += `
    ORDER BY u.name ASC, r.name ASC
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search) => {
  let query = `
    SELECT COUNT(*) as total
    FROM user_roles ur
    JOIN users u ON u.id = ur.user_id
    JOIN roles r ON r.id = ur.role_id
  `;

  const params = [];

  if (search) {
    query += `
      WHERE u.name LIKE ?
      OR r.name LIKE ?
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      ur.*,
      u.name AS user_name,
      r.name AS role_name
    FROM user_roles ur
    JOIN users u ON u.id = ur.user_id
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.id = ?
    LIMIT 1
  `, [id]);

  return rows[0];
};

export const create = async (id, user_id, role_id) => {
  await db.query(
    "INSERT INTO user_roles (id, user_id, role_id) VALUES (?, ?, ?)",
    [id, user_id, role_id]
  );
  return { id, user_id, role_id };
};

// export const update = async (id, male_athletes, female_athletes, total_athletes, total_coaches) => {
//   await db.query(
//     "UPDATE user_roles SET male_athletes = ?, female_athletes = ?, total_athletes = ?, total_coaches = ? WHERE id = ?",
//     [male_athletes, female_athletes, total_athletes, total_coaches, id]
//   );
//   return { id, male_athletes, female_athletes, total_athletes, total_coaches };
// };

export const remove = async (id) => {
  await db.query("DELETE FROM user_roles WHERE id = ?", [id]);
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
    SELECT ur.*, r.name AS role_name
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = ?
    ORDER BY r.name ASC
    `, [user_id]
  );
  return rows;
};

export const insertMany = async (rows) => {
  if (rows.length === 0) return;
  await db.query(
    `
    INSERT INTO user_roles (id, user_id, role_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE id = id
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