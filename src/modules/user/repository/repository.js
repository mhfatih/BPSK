import { db } from "../../../config/database.js";

export const getAll = async (limit, offset, search) => {
  let query = `
    SELECT * 
    FROM users
  `;
  
  const params = [];

  if (search) {
    query += ` WHERE users.name LIKE ? `;
    params.push(`%${search}%`);
  }

  query += ` ORDER BY users.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search) => {
  let query = `SELECT COUNT(*) as total FROM users`;
  const params = [];

  if (search) {
    query += ` WHERE users.name LIKE ?`;
    params.push(`%${search}%`);
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
};

export const getByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

export const create = async (id, name, email, hashedPassword, verify) => {
    await db.query(
        "INSERT INTO users (id, name, email, password, is_verified, verified_at) VALUES (?, ?, ?, ?, ?, IF(? = 1, NOW(), NULL))",
        [id, name, email, hashedPassword, verify, verify]
    );
    return { id, name, email };
};

export const update = async (id, name, email, hashedPassword) => {
  await db.query(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    [name, email, hashedPassword, id]
  );
  return { id, name, email, hashedPassword };
};

export const verify = async (id, verify) => {
  await db.query(
    "UPDATE users SET is_verified = ?, verified_at = IF(? = 1, NOW(), NULL) WHERE id = ?",
    [verify, verify, id]
  );
  return { id, verify };
};

export const changePassword = async (id, hashedPassword) => {
  await db.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, id]
  );
  return { id, hashedPassword };
};

export const remove = async (id) => {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return true;
};

export const updateProfile = async (id, filename, name) => {
  await db.query(
    "UPDATE users SET profile_picture = ?, name = ? WHERE id = ?",
    [filename, name, id]
  );
  return true;
};
