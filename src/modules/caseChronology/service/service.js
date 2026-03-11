import * as repo from "../repository/repository.js";
import { replaceFile } from "../../../utils/file.util.js";

export const getData = async (id, user) => {
  const data = await repo.getData(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  return data;
};

export const update = async (id, chronology, demand_type, user) => {
  const data = await repo.getData(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  await repo.update(id, chronology, demand_type);
  return await repo.getData(id);
};
