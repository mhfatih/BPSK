import * as repo from "../repository/repository.js";
import * as territoryRepo from "../../territory/repository/repository.js";
import { replaceFile } from "../../../utils/file.util.js";

export const getData = async (id, user) => {
  const data = await repo.getData(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  return data;
};

export const update = async (id, territory_id, reporter_name, reporter_age, reporter_gender, reporter_address, reporter_email, reporter_phone, reporter_postal_code, reporter_nik, user, files = {}) => {
  const data = await repo.getData(id);
  if (!data) throw new Error("Data not found");
  const territory = await territoryRepo.getById(territory_id);
  if (!territory) throw new Error("Territory not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  const reporter_ktp_file = replaceFile(data.reporter_ktp_file, files.reporter_ktp_file);
  const reporter_contextual_file = replaceFile(data.reporter_contextual_file, files.reporter_contextual_file);

  await repo.update(id, territory_id, reporter_name, reporter_age, reporter_gender, reporter_address, reporter_email, reporter_phone, reporter_postal_code, reporter_nik, reporter_ktp_file, reporter_contextual_file);
  return await repo.getData(id);
};
