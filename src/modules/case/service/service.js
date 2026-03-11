import * as repo from "../repository/repository.js";
import * as territoryRepo from "../../territory/repository/repository.js";
import { replaceFile } from "../../../utils/file.util.js";
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

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  return data;
};

export const create = async (user_id) => {
  const status = "Draft";
  const id = uuidv4();
  return repo.create(id, user_id, status);
};

export const send = async (id, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  const allowedStatus = ["Draft", "Rejected"];
  if (!allowedStatus.includes(data.status)) throw new Error("Invalid status");

  if (!data.territory_id) throw new Error("Required field must be filled");
  const status = "Submitted";
  const submitted_at = new Date();

  await repo.send(id, status, submitted_at);
  return await repo.getById(id);
};

export const verify = async (id, status, registration_number, rejected_reason, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(data.region_id)) throw new Error("Forbidden");
  if (data.status !== "Submitted") throw new Error("Invalid status");
  
  const verified_at = new Date();
  const allowedStatus = ["Approved", "Rejected"];
  if (!allowedStatus.includes(status)) throw new Error("Invalid input status");
  if (status === "Approved" && !registration_number) throw new Error("Required field must be filled");
  if (status === "Approved") rejected_reason = null;
  if (status === "Rejected" && !rejected_reason) throw new Error("Required field must be filled");
  if (status === "Rejected") registration_number = null;

  await repo.verify(id, status, registration_number, rejected_reason, verified_at, user.id);
  return await repo.getById(id);
};

export const process = async (id, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(data.region_id)) throw new Error("Forbidden");
  if (data.status !== "Approved") throw new Error("Invalid status");
  
  const processed_at = new Date();
  const status = "In Progress";

  await repo.process(id, status, processed_at, user.id);
  return await repo.getById(id);
};

export const complete = async (id, loss_amount, user, files = {}) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  if (!userRegions.includes(data.region_id)) throw new Error("Forbidden");
  if (data.status !== "In Progress") throw new Error("Invalid status");
  // if (!loss_amount || !files.court_file) throw new Error("Required field must be filled");
  
  const completed_at = new Date();
  const status = "Completed";
  const court_file = replaceFile(data.court_file, files.court_file);

  await repo.complete(id, status, loss_amount, court_file, completed_at, user.id);
  return await repo.getById(id);
};

export const update = async (id, territory_id, name, description, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");
  const territory = await territoryRepo.getById(territory_id);
  if (!territory) throw new Error("Territory not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  await repo.update(id, territory_id, name, description);
  return await repo.getById(id);
};

export const remove = async (id, user) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  await repo.remove(id);
  return true;
};
