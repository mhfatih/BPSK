import { apiClient } from "./apiClient";
import { apiUploadClient } from "./apiUploadClient";

// Ambil semua kasus
export const getAllKasus = async () => {
  return apiClient("/kasus", {
    method: "GET",
    credentials: "include",
  });
};

// Ambil data kasus by ID
export const getKasusById = async (id) => {
  return apiClient(`/kasus/${id}`, {
    method: "GET",
    credentials: "include",
  });
};

// Tambah kasus baru
export const tambahKasus = async () => {
  return apiClient("/kasus/kasus-add", {
    method: "POST",
    credentials: "include",
  });
};

// Update data diri
export const updateDataDiri = async (id, formData) => {
  return apiUploadClient(`/kasus/${id}/data-diri`, {
    method: "PUT",
    credentials: "include",
    formData,
  });
};

// Update pelaku usaha
export const updatePelakuUsaha = async (id, body) => {
  return apiClient(`/kasus/${id}/pelaku-usaha`, {
    method: "PUT",
    credentials: "include",
    body: body,
  });
};

// Update pengaduan
export const updatePengaduan = async (id, formData) => {
  return apiUploadClient(`/kasus/${id}/tentang-pengaduan`, {
    method: "PUT",
    credentials: "include",
    formData,
  });
};

// Update kronologis
export const updateKronologis = async (id, body) => {
  return apiClient(`/kasus/${id}/kronologis`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
};

// Submit kasus
export const submitKasus = async (id) => {
  return apiClient(`/kasus/${id}/submit-kasus`, {
    method: "PUT",
    credentials: "include",
    body: {konfirmasi: true},
  });
};

// Verify kasus
export const verifyKasus = async (id, body) => {
  return apiClient(`/kasus/${id}/verify-kasus`, {
    method: "PUT",
    credentials: "include",
    body,
  });
};