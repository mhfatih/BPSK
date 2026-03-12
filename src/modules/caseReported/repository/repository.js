import { db } from "../../../config/database.js";

const buildFilters = (search, case_id, user_id, regions) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(case_reporteds.company LIKE ?)`);
    params.push(`%${search}%`);
  }

  if (case_id) {
    conditions.push(`cases.id = ?`);
    params.push(case_id);
  }

  if (regions && regions.length > 0) {
    const placeholders = regions.map(() => "?").join(",");
    conditions.push(`(cases.user_id = ? OR territories.region_id IN (${placeholders}))`);
    params.push(user_id, ...regions);
  } else {
    conditions.push(`cases.user_id = ?`);
    params.push(user_id);
  }

  return { conditions, params };
};

export const getAll = async (limit, offset, search, case_id, user_id, regions) => {
  let query = `
    SELECT case_reporteds.*, cases.reporter_name AS reporter_name, territories.name AS territory_name
    FROM case_reporteds
    JOIN cases ON cases.id = case_reporteds.case_id
    JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, case_id, user_id, regions);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY case_reporteds.created_at ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

export const countAll = async (search, case_id, user_id, regions) => {
  let query = `
    SELECT COUNT(*) as total
    FROM case_reporteds
    JOIN cases ON cases.id = case_reporteds.case_id
    JOIN territories ON territories.id = cases.territory_id
  `;

  const { conditions, params } = buildFilters(search, case_id, user_id, regions);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  const [[row]] = await db.query(query, params);
  return row.total;
};

export const getById = async (id) => {
  const [[rows]] = await db.query(`
    SELECT case_reporteds.*, cases.reporter_name as case_name, territories.name as territory_name, territories.region_id
    FROM case_reporteds 
    JOIN cases ON cases.id = case_reporteds.case_id
    JOIN territories ON territories.id = cases.territory_id
    WHERE case_reporteds.id = ?
    `, [id]);
  return rows;
};

export const create = async (id, case_id, territory_id, company, owner, address, postal_code, phone, email) => {
  await db.query(
    "INSERT INTO case_reporteds (id, case_id, territory_id, company, owner, address, postal_code, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, case_id, territory_id, company, owner, address, postal_code, phone, email]
  );
  return { id, case_id, territory_id, company, owner, address, postal_code, phone, email };
};

export const update = async (id, territory_id, company, owner, address, postal_code, phone, email) => {
  await db.query(
    "UPDATE case_reporteds SET territory_id = ?, company = ?, owner = ?, address = ?, postal_code = ?, phone = ?, email = ? WHERE id = ?",
    [territory_id, company, owner, address, postal_code, phone, email, id]
  );
  return { id, territory_id, company, owner, address, postal_code, phone, email };
};

export const remove = async (id) => {
  await db.query("DELETE FROM case_reporteds WHERE id = ?", [id]);
};

export const insertMany = async (rows) => {
  if (rows.length === 0) return;
  await db.query(
    `
    INSERT INTO case_reporteds (id, case_id, territory_id, company, owner, address, postal_code, phone, email)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      territory_id = VALUES(territory_id),
      company = VALUES(company),
      owner = VALUES(owner),
      address = VALUES(address),
      postal_code = VALUES(postal_code),
      phone = VALUES(phone),
      email = VALUES(email)
    `,
    [rows]
  );
};

export const deleteMany = async (case_id, relations) => {
  if (!relations || relations.length === 0) {
    await db.query(
      `DELETE FROM case_reporteds WHERE case_id = ?`,
      [case_id]
    );
    return;
  }

  await db.query(
    `
    DELETE FROM case_reporteds
    WHERE case_id = ? AND id NOT IN (?)
    `,
    [case_id, relations]
  );
};