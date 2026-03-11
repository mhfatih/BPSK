import { db } from "../../../config/database.js";

const buildFilters = (search, region_id) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(territories.name LIKE ? OR regions.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (region_id) {
    conditions.push(`territories.region_id = ?`);
    params.push(region_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, region_id) => {
  let query = `
    SELECT territories.*, regions.name AS region_name
    FROM territories
    JOIN regions ON regions.id = territories.region_id
  `;
  
  const { conditions, params } = buildFilters(search, region_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY territories.name ASC, regions.name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, region_id) => {
  let query = `
    SELECT COUNT(*) as total
    FROM territories
    JOIN regions ON regions.id = territories.region_id
  `;

  const { conditions, params } = buildFilters(search, region_id);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [rows] = await db.query(`
    SELECT territories.*, regions.name AS region_name
    FROM territories
    JOIN regions ON regions.id = territories.region_id
    WHERE territories.id = ?`, [id]);
  return rows[0];
};

export const create = async (id, region_id, name, description) => {
  await db.query(
    "INSERT INTO territories (id, region_id, name, description) VALUES (?, ?, ?, ?)",
    [id, region_id, name, description]
  );
  return { id, region_id, name, description };
};

export const update = async (id, region_id, name, description) => {
  await db.query(
    "UPDATE territories SET region_id = ?, name = ?, description = ? WHERE id = ?",
    [region_id, name, description, id]
  );
  return { id, region_id, name, description };
};

export const remove = async (id) => {
  await db.query("DELETE FROM territories WHERE id = ?", [id]);
};
