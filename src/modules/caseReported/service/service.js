import * as repo from "../repository/repository.js";
import * as caseRepo from "../../case/repository/repository.js";
import * as territoryRepo from "../../territory/repository/repository.js";
import { v4 as uuidv4 } from "uuid";

export const getAll = async (page, perPage, search, case_id, user) => {
  const offset = (page - 1) * perPage;
  const regions = user.regions.map(r => r.region_id);
  const data = await repo.getAll(perPage, offset, search, case_id, user.id, regions);
  const total = await repo.countAll(search, case_id, user.id, regions);

  return { data, meta: { total, per_page: perPage, current_page: page, first_page: 1, last_page: Math.ceil(total / perPage) } };
};

export const getById = async (id, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const cases = await caseRepo.getById(data.case_id);
  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = cases.user_id === user.id || userRegions.includes(cases.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  return data;
};

export const create = async (case_id, territory_id, company, owner, address, postal_code, phone, email, user) => {
  const cases = await caseRepo.getById(case_id);
  if (!cases) throw new Error("Case not found");

  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(cases.region_id)) throw new Error("Forbidden");
  const allowedStatus = ["Draft", "Rejected"];
  if (!allowedStatus.includes(cases.status)) throw new Error("Invalid status");

  const id = uuidv4();
  return repo.create(id, case_id, territory_id, company, owner, address, postal_code, phone, email);
};

export const update = async (id, territory_id, company, owner, address, postal_code, phone, email, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const cases = await caseRepo.getById(data.case_id);
  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(cases.region_id)) throw new Error("Forbidden");
  const allowedStatus = ["Draft", "Rejected"];
  if (!allowedStatus.includes(cases.status)) throw new Error("Invalid status");

  await repo.update(id, territory_id, company, owner, address, postal_code, phone, email);
  return await repo.getById(id);
};

export const remove = async (id, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const cases = await caseRepo.getById(data.case_id);
  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(cases.region_id)) throw new Error("Forbidden");
  const allowedStatus = ["Draft", "Rejected"];
  if (!allowedStatus.includes(cases.status)) throw new Error("Invalid status");

  await repo.remove(id);
  return true;
};

export const assignRelations = async (case_id, items = []) => {
  const cases = await caseRepo.getById(case_id);
  if (!cases) throw new Error("Case not found");
  
  const relations = [];
  const rows = [];
  
  for (const item of items) {
    const territory = await territoryRepo.getById(item.territory_id);
    if (!territory) throw new Error("Territory not found");
    const id = item.id || uuidv4();
    relations.push(id);
    rows.push([id, case_id, item.territory_id, item.company, item.owner, item.address, item.postal_code, item.phone, item.email]);
  }

  await repo.deleteMany(case_id, relations);
  await repo.insertMany(rows);
  return items;
};