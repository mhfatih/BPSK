// src/api/apiUploadClient.js
const API_BASE_URL = "http://localhost:3000/api";

/**
 * Helper untuk request API yang mengirim file (pakai FormData)
 * @param {string} endpoint - endpoint API (misal "/upload")
 * @param {object} options - opsi seperti method, formData, credentials
 */
export const apiUploadClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "POST",
    credentials: options.credentials || "include",
    body: options.formData, // gunakan FormData langsung, tanpa Content-Type
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
      console.warn("⚠️ Token tidak valid atau sudah kadaluarsa");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Sesi login berakhir. Silakan login kembali.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengirim data file");
    }

    return data;
  } catch (err) {
    console.error("apiUploadClient error:", err);
    throw err;
  }
};