import * as repo from "../repository/repository.js";
import * as roleRepo from "../../role/repository/repository.js";
import * as permissionRepo from "../../permission/repository/repository.js";

export const getAll = async (page, perPage, search, role_id, permission_id) => {
  const offset = (page - 1) * perPage;
  const data = await repo.getAll(perPage, offset, search, role_id, permission_id);
  const total = await repo.countAll(search, role_id, permission_id);

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

export const create = async (role_id, permission_id) => {
  const role = await roleRepo.getById(role_id);
  if (!role) throw new Error("Role not found");
  const permission = await permissionRepo.getById(permission_id);
  if (!permission) throw new Error("Permission not found");

  return repo.create(role_id, permission_id);
};

export const remove = async (role_id, permission_id) => {
  const role = await roleRepo.getById(role_id);
  if (!role) throw new Error("Role not found");
  const permission = await permissionRepo.getById(permission_id);
  if (!permission) throw new Error("Permission not found");
  const relation = await repo.checkRelations(role_id, permission_id);
  if (!relation) throw new Error("Relation not found");

  await repo.remove(role_id, permission_id);
  return true;
};

export const getRelations = async (role_id) => {
  const user = await roleRepo.getById(role_id);
  if (!user) throw new Error("Role not found");

  return repo.getRelations(role_id);
};

export const assignRelations = async (role_id, items = []) => {
  const user = await roleRepo.getById(role_id);
  if (!user) throw new Error("User not found");

  const relations = [];
  const rows = [];

  for (const item of items) {
    relations.push(item.permission_id);
    rows.push([role_id, item.permission_id]);
  }

  await repo.deleteMany(role_id, relations);
  await repo.insertMany(rows);
  return items;
};