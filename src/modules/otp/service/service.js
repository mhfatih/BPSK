import * as repo from "../repository/repository.js";
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

export const create = async (userId, otpHash, expiresAt, attempts) => {
    const id = uuidv4();
    return repo.create(id, userId, otpHash, expiresAt, attempts);
};

export const update = async (id, otpHash, expiresAt, attempts) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data tidak ditemukan");

    return repo.update(id, otpHash, expiresAt, attempts);
};

export const remove = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data tidak ditemukan");

    await repo.remove(id);
    return true;
};
