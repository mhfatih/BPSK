import * as repo from "../repository/repository.js";
import * as userRoleRepo from "../../userRole/repository/repository.js";
import * as userRegionRepo from "../../userRegion/repository/repository.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const getAll = async (page, perPage, search) => {
  const offset = (page - 1) * perPage;

  const data = await repo.getAll(perPage, offset, search);
  const total = await repo.countAll(search);

  return { data, meta: { total, per_page: perPage, current_page: page, first_page: 1, last_page: Math.ceil(total / perPage) } };
};

export const getById = async (id) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data tidak ditemukan");
  return data;
};

export const create = async (name, email, password) => {
  if (!name) throw new Error("Name wajib diisi");
  if (!email) throw new Error("Email wajib diisi");
  if (!password) throw new Error("Password wajib diisi");

  const data = await repo.getByEmail(email);
  if (data) throw new Error("Email sudah terdaftar");
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await repo.create(id, name, email, hashedPassword, 1);
  return { id, name, email };
};

export const update = async (id, name, email, password) => {
  if (!name) throw new Error("Name tidak boleh kosong");
  if (!email) throw new Error("Email tidak boleh kosong");
  const data = await repo.getById(id);
  if (!data) throw new Error("Data tidak ditemukan");

  if (email && email !== data.email) {
    const emailUsed = await repo.getByEmail(email);
    if (emailUsed) throw new Error("Email sudah digunakan");
  }

  let hashedPassword = data.password;
  if (password) hashedPassword = await bcrypt.hash(password, 10);
  await repo.update(id, name, email, hashedPassword);
  return { id, name, email};
};

export const remove = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("User tidak ditemukan");

    await repo.remove(id);
    return true;
};

export const getAuth = async (id) => {
  const data = await repo.getById(id);
  if (!data) throw new Error("Data tidak ditemukan");

  const roles = await userRoleRepo.getRelations(id);
  const regions = await userRegionRepo.getRelations(id);
  const { password, ...safeData } = data;

  return { ...safeData, roles, regions };
};