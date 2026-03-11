import * as repo from "../repository/repository.js";
import { v4 as uuidv4 } from "uuid";

export const getAll = async (page, perPage, search, region_id) => {
  const offset = (page - 1) * perPage;

  const data = await repo.getAll(perPage, offset, search, region_id);
  const total = await repo.countAll(search, region_id);

  return { data, meta: { total, per_page: perPage, current_page: page, first_page: 1, last_page: Math.ceil(total / perPage) } };
};

export const getById = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");
    return data;
};

export const create = async (region_id, name, description) => {
    if (!name) throw new Error("Nama wajib diisi");
    const id = uuidv4();
    return repo.create(id, region_id, name, description);
};

export const update = async (id, region_id, name, description) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");

    await repo.update(id, region_id, name, description);
    return await repo.getById(id);
};

export const remove = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");

    await repo.remove(id);
    return true;
};
