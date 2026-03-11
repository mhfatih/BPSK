import * as repo from "../repository/repository.js";
import * as permissionRepo from "../../permission/repository/repository.js";
import { v4 as uuidv4 } from "uuid";

export const getAll = async (page, perPage, search) => {
  const offset = (page - 1) * perPage;

  const data = await repo.getAll(perPage, offset, search);
  const total = await repo.countAll(search);

  return { data, meta: { total, per_page: perPage, current_page: page, first_page: 1, last_page: Math.ceil(total / perPage) } };
};

export const getById = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");
    return data;
};

export const create = async (name, label, code, url, icon) => {
    if (!name) throw new Error("Nama wajib diisi");
    const id = uuidv4();

    await repo.create(id, name, label, code, url, icon);
    const permissions = [
        "create",
        "read",
        "update",
        "delete",
    ];

    for (const action of permissions) {
        await permissionRepo.create(uuidv4(), id, `${code}.${action}`);
    }
    return await repo.getById(id);
};

export const update = async (id, name, label, code, url, icon) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");

    await repo.update(id, name, label, code, url, icon);
    const permissions = await permissionRepo.getByOwnerId(id);
    for (const permission of permissions) {
        const action = permission.name.split(".")[1];
        await permissionRepo.update(permission.id, id, `${code}.${action}`);
    }
    return await repo.getById(id);
};

export const remove = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");

    await repo.remove(id);
    return true;
};
