import * as repo from "../repository/repository.js";
import * as userRepo from "../../user/repository/repository.js";
import * as roleRepo from "../../role/repository/repository.js";

export const getAll = async (page, perPage, search, user_id, role_id) => {
  const offset = (page - 1) * perPage;
  const data = await repo.getAll(perPage, offset, search, user_id, role_id);
  const total = await repo.countAll(search, user_id, role_id);

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

export const create = async (user_id, role_id) => {
  const user = await userRepo.getById(user_id);
  if (!user) throw new Error("User not found");
  const role = await roleRepo.getById(role_id);
  if (!role) throw new Error("Role not found");

  return repo.create(user_id, role_id);
};

export const remove = async (user_id, role_id) => {
  const user = await userRepo.getById(user_id);
  if (!user) throw new Error("User not found");
  const role = await roleRepo.getById(role_id);
  if (!role) throw new Error("Role not found");
  const relation = await repo.checkRelations(user_id, role_id);
  if (!relation) throw new Error("Relation not found");

  await repo.remove(user_id, role_id);
  return true;
};

export const getRelations = async (user_id) => {
  const user = await userRepo.getById(user_id);
  if (!user) throw new Error("User not found");

  return repo.getRelations(user_id);
};

export const assignRelations = async (user_id, items = []) => {
  const user = await userRepo.getById(user_id);
  if (!user) throw new Error("User not found");

  const relations = [];
  const rows = [];

  for (const item of items) {
    relations.push(item.role_id);
    rows.push([user_id, item.role_id]);
  }

  await repo.deleteMany(user_id, relations);
  await repo.insertMany(rows);
  return items;
};