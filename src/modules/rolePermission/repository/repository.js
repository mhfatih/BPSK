import { db } from "../../../config/database.js";

export const getAll = async (limit, offset, search) => {
  let query = `
    SELECT 
      rp.*,
      r.name AS role_name,
      p.name AS permission_name
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
  `;

  const params = [];

  if (search) {
    query += `
      WHERE r.name LIKE ?
      OR p.name LIKE ?
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += `
    ORDER BY r.name ASC, p.name ASC
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search) => {
  let query = `
    SELECT COUNT(*) as total
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
  `;

  const params = [];

  if (search) {
    query += `
      WHERE r.name LIKE ?
      OR p.name LIKE ?
    `;
    params.push(`%${search}%`, `%${search}%`);
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      rp.*,
      r.name AS role_name,
      p.name AS permission_name
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE rp.id = ?
    LIMIT 1
  `, [id]);

  return rows[0];
};

export const checkRelations = async (role_id, permission_id) => {
  const [rows] = await db.query(
    `SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ? LIMIT 1`,
    [role_id, permission_id]
  );
  return rows[0];
};

export const create = async (id, role_id, permission_id) => {
  await db.query(
    "INSERT INTO role_permissions (id, role_id, permission_id) VALUES (?, ?, ?)",
    [id, role_id, permission_id]
  );
  return { id, role_id, permission_id };
};

// export const update = async (id, male_athletes, female_athletes, total_athletes, total_coaches) => {
//   await db.query(
//     "UPDATE role_permissions SET male_athletes = ?, female_athletes = ?, total_athletes = ?, total_coaches = ? WHERE id = ?",
//     [male_athletes, female_athletes, total_athletes, total_coaches, id]
//   );
//   return { id, male_athletes, female_athletes, total_athletes, total_coaches };
// };

export const remove = async (id) => {
  await db.query("DELETE FROM role_permissions WHERE id = ?", [id]);
};

export const getRelations = async (role_id) => {
  const [rows] = await db.query(`
    SELECT rp.*, p.name AS permission_name
    FROM role_permissions rp
    JOIN permissions p ON p.id = rp.permission_id
    WHERE rp.role_id = ?
    ORDER BY p.name ASC
    `, [role_id]
  );
  return rows;
};

export const insertMany = async (rows) => {
  if (rows.length === 0) return;
  await db.query(
    `
    INSERT INTO role_permissions (id, role_id, permission_id)
    VALUES ?
    ON DUPLICATE KEY UPDATE id = id
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