import { db } from "../../../config/database.js";

export const getAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      m.*,
      mo.name AS module_name
    FROM menus m
    JOIN modules mo ON mo.id = m.module_id
    ORDER BY m.sort_order
    `);
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM menus WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (id, module_id, parent_id, sort_order) => {
  await db.query(
    "INSERT INTO menus (id, module_id, parent_id, sort_order) VALUES (?, ?, ?, ?)",
    [id, module_id, parent_id, sort_order]
  );
  return { id, module_id, parent_id, sort_order };
};

export const update = async (id, parent_id, sort_order) => {
  await db.query(
    "UPDATE menus SET parent_id = ?, sort_order = ? WHERE id = ?",
    [parent_id, sort_order, id]
  );
  return { id, parent_id, sort_order };
};

export const remove = async (id) => {
  await db.query("DELETE FROM menus WHERE id = ?", [id]);
};
