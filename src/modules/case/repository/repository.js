import { db } from "../../../config/database.js";

const buildFilters = (search, user_id, regions) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(users.name LIKE ? OR territories.name LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (regions && regions.length > 0) {
    const placeholders = regions.map(() => "?").join(",");
    conditions.push(`(cases.user_id = ? OR (territories.region_id IN (${placeholders}) AND cases.status NOT IN ('Draft','Rejected')))`);
    params.push(user_id, ...regions);
  } else {
    conditions.push(`cases.user_id = ?`);
    params.push(user_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, user_id, regions) => {

  let query = `
    SELECT cases.*, users.name AS user_name, territories.name AS territory_name
    FROM cases
    JOIN users ON users.id = cases.user_id
    LEFT JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, user_id, regions);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY cases.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, user_id, regions) => {

  let query = `
    SELECT COUNT(*) as total
    FROM cases
    JOIN users ON users.id = cases.user_id
    LEFT JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, user_id, regions);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [[rows]] = await db.query(`
    SELECT cases.*, territories.name as territory_name, territories.region_id
    FROM cases 
    LEFT JOIN territories ON territories.id = cases.territory_id
    WHERE cases.id = ?
    `, [id]);
  return rows;
};

export const create = async (id, user_id, status) => {
  await db.query(
    "INSERT INTO cases (id, user_id, status) VALUES (?, ?, ?)",
    [id, user_id, status]
  );
  return { id, user_id, status };
};

export const update = async (id, territory_id, name, description) => {
  await db.query(
    "UPDATE cases SET territory_id = ?, name = ?, description = ? WHERE id = ?",
    [territory_id, name, description, id]
  );
  return { id, territory_id, name, description };
};

export const send = async (id, status, submitted_at) => {
  await db.query(
    "UPDATE cases SET status = ?, submitted_at = ? WHERE id = ?",
    [status, submitted_at, id]
  );
  return { id, status, submitted_at };
};

export const verify = async (id, status, registration_number, rejected_reason, verified_at, verified_by) => {
  await db.query(
    "UPDATE cases SET status = ?, registration_number = ?, rejected_reason = ?, verified_at = ?, verified_by = ? WHERE id = ?",
    [status, registration_number, rejected_reason, verified_at, verified_by, id]
  );
  return { id, status, registration_number, rejected_reason, verified_at, verified_by };
};

export const process = async (id, status, processed_at, processed_by) => {
  await db.query(
    "UPDATE cases SET status = ?, processed_at = ?, processed_by = ? WHERE id = ?",
    [status, processed_at, processed_by, id]
  );
  return { id, status, processed_at, processed_by };
};

export const complete = async (id, status, loss_amount, court_file, completed_at, completed_by) => {
  await db.query(
    "UPDATE cases SET status = ?, loss_amount = ?, court_file = ?, completed_at = ?, completed_by = ? WHERE id = ?",
    [status, loss_amount, court_file, completed_at, completed_by, id]
  );
  return { id, status, loss_amount, court_file, completed_at, completed_by };
};

export const remove = async (id) => {
  await db.query("DELETE FROM cases WHERE id = ?", [id]);
};
