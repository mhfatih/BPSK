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

export const update = async (id, complaint_type, complaint_date, complaint_time, complaint_location, complaint_loss, complaint_statement, complaint_receipt, complaint_witness, complaint_witness_relation, complaint_evidence, user, files = {}) => {
  const data = await repo.getData(id);
  if (!data) throw new Error("Data not found");

  const userRegions = user.regions.map(r => r.region_id);
  const hasAccess = data.user_id === user.id || userRegions.includes(data.region_id);
  if (!hasAccess) throw new Error("Forbidden");

  const complaint_receipt_file = replaceFile(data.complaint_receipt_file, files.complaint_receipt_file);

  await repo.update(id, complaint_type, complaint_date, complaint_time, complaint_location, complaint_loss, complaint_statement, complaint_receipt, complaint_witness, complaint_witness_relation, complaint_evidence, complaint_receipt_file);
  return await repo.getData(id);
};
