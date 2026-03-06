import { db } from "../../../config/database.js";

export const getAll = async (limit, offset, search) => {
  let query = `
    SELECT 
      ut.*,
      u.name AS user_name,
      t.name AS territory_name
    FROM user_territories ut
    JOIN users u ON u.id = ut.user_id
    JOIN territories t ON t.id = ut.territory_id
  `;

  const params = [];

  if (search) {
    query += `
      WHERE u.name LIKE ?
      OR t.name LIKE ?
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += `
    ORDER BY u.name ASC, t.name ASC
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search) => {
  let query = `
    SELECT COUNT(*) as total
    FROM user_territories ut
    JOIN users u ON u.id = ut.user_id
    JOIN territories t ON t.id = ut.territory_id
  `;

  const params = [];

  if (search) {
    query += `
      WHERE u.name LIKE ?
      OR t.name LIKE ?
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      ut.*,
      u.name AS user_name,
      t.name AS territory_name
    FROM user_territories ut
    JOIN users u ON u.id = ut.user_id
    JOIN territories t ON t.id = ut.territory_id
    WHERE ut.id = ?
    LIMIT 1
  `, [id]);

  return rows[0];
};

export const create = async (id, user_id, territory_id) => {
  await db.query(
    "INSERT INTO user_territories (id, user_id, territory_id) VALUES (?, ?, ?)",
    [id, user_id, territory_id]
  );
  return { id, user_id, territory_id };
};

// export const update = async (id, male_athletes, female_athletes, total_athletes, total_coaches) => {
//   await db.query(
//     "UPDATE user_territories SET male_athletes = ?, female_athletes = ?, total_athletes = ?, total_coaches = ? WHERE id = ?",
//     [male_athletes, female_athletes, total_athletes, total_coaches, id]
//   );
//   return { id, male_athletes, female_athletes, total_athletes, total_coaches };
// };

export const remove = async (id) => {
  await db.query("DELETE FROM user_territories WHERE id = ?", [id]);
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
    INSERT INTO user_territories (id, user_id, territory_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE id = id
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