import { db } from "../../../config/database.js";

export const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM modules");
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM modules WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (id, name, description) => {
  await db.query(
    "INSERT INTO modules (id, name, description) VALUES (?, ?, ?)",
    [id, name, description]
  );
  return { id, name, description };
};

export const update = async (id, name, description) => {
  await db.query(
    "UPDATE modules SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
  return { id, name, description };
};

export const remove = async (id) => {
  await db.query("DELETE FROM modules WHERE id = ?", [id]);
};
