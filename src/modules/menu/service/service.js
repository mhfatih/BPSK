import * as repo from "../repository/repository.js";
import { v4 as uuidv4 } from "uuid";

export const getAll = async () => {
    return repo.getAll();
};

export const getById = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");
    return data;
};

export const create = async (module_id, parent_id, sort_order) => {
    const id = uuidv4();
    return repo.create(id, module_id, parent_id, sort_order);
};

export const update = async (id, module_id, parent_id, sort_order) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");

    await repo.update(id, module_id, parent_id, sort_order);
    return await repo.getById(id);
};

export const remove = async (id) => {
    const data = await repo.getById(id);
    if (!data) throw new Error("Data not found");

    await repo.remove(id);
    return true;
};
