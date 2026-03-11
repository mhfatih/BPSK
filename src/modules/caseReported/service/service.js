import * as repo from "../repository/repository.js";
import * as caseRepo from "../../case/repository/repository.js";
import { v4 as uuidv4 } from "uuid";

export const getAll = async (page, perPage, search, user) => {
  const offset = (page - 1) * perPage;
  const regions = user.regions.map(r => r.region_id);
  const data = await repo.getAll(perPage, offset, search, user.id, regions);
  const total = await repo.countAll(search, user.id, regions);

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

export const create = async (case_id, name, description, user) => {
  if (!name) throw new Error("Nama wajib diisi");
  const cases = await caseRepo.getById(case_id);
  if (!cases) throw new Error("Case not found");
  
  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(cases.region_id)) throw new Error("Forbidden");
  if (cases.status !== "In Progress") throw new Error("Invalid status");

  const id = uuidv4();
  return repo.create(id, case_id, name, description);
};

export const update = async (id, name, description, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const cases = await caseRepo.getById(data.case_id);
  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(cases.region_id)) throw new Error("Forbidden");
  if (cases.status !== "In Progress") throw new Error("Invalid status");

  await repo.update(id, name, description);
  return await repo.getById(id);
};

export const remove = async (id, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const cases = await caseRepo.getById(data.case_id);
  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(cases.region_id)) throw new Error("Forbidden");
  if (cases.status !== "In Progress") throw new Error("Invalid status");

  await repo.remove(id);
  return true;
};
