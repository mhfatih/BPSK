import * as repo from "../repository/repository.js";
import * as userRepo from "../../user/repository/repository.js";
import * as territoryRepo from "../../territory/repository/repository.js";
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

export const create = async (user_id, territory_id) => {
  const user = await userRepo.getById(user_id);
  if (!user) throw new Error("User tidak ditemukan");
  const territory = await territoryRepo.getById(territory_id);
  if (!territory) throw new Error("Territory tidak ditemukan");

  const id = uuidv4();
  return repo.create(id, user_id, territory_id);
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

export const getRelations = async (user_id) => {
  const user = await userRepo.getById(user_id);
  if (!user) throw new Error("User tidak ditemukan");

  return repo.getRelations(user_id);
};

export const assignRelations = async (user_id, items = []) => {
  const user = await userRepo.getById(user_id);
  if (!user) throw new Error("User tidak ditemukan");

  const relations = [];
  const rows = [];

  for (const item of items) {
    relations.push(item.territory_id);
    rows.push([uuidv4(), user_id, item.territory_id]);
  }

  await repo.deleteMany(user_id, relations);
  await repo.insertMany(rows);
  return items;
};