import * as repo from "../repository/repository.js";
import * as roleRepo from "../../role/repository/repository.js";
import * as permissionRepo from "../../permission/repository/repository.js";
import { v4 as uuidv4 } from "uuid";

export const getAll = async (page, perPage, search) => {
  const offset = (page - 1) * perPage;

  const data = await repo.getAll(perPage, offset, search);
  const total = await repo.countAll(search);

  return {
    data,
    meta: {
      total,
      per_page: perPage,
      current_page: page,
      first_page: 1,
      last_page: Math.ceil(total / perPage),
    }
  };
};

export const getById = async (id) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data tidak ditemukan");
  return data;
};

export const create = async (role_id, permission_id) => {
  const role = await roleRepo.getById(role_id);
  if (!role) throw new Error("Role tidak ditemukan");
  const permission = await permissionRepo.getById(permission_id);
  if (!permission) throw new Error("Permission tidak ditemukan");

  const id = uuidv4();
  return repo.create(id, role_id, permission_id);
};

// export const update = async (id, male_athletes, female_athletes, total_athletes, total_coaches) => {
//   const data = await repo.getById(id);
//   if (!data) throw new Error("Data tidak ditemukan");

//   return repo.update(id, male_athletes, female_athletes, total_athletes, total_coaches);
// };

export const remove = async (id) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data tidak ditemukan");

  await repo.remove(id);
  return true;
};

export const getRelations = async (role_id) => {
  const user = await roleRepo.getById(role_id);
  if (!user) throw new Error("Role tidak ditemukan");

  return repo.getRelations(role_id);
};

export const assignRelations = async (role_id, items = []) => {
  const user = await roleRepo.getById(role_id);
  if (!user) throw new Error("User tidak ditemukan");

  const relations = [];
  const rows = [];

  for (const item of items) {
    relations.push(item.permission_id);
    rows.push([uuidv4(), role_id, item.permission_id]);
  }

  await repo.deleteMany(role_id, relations);
  await repo.insertMany(rows);
  return items;
};