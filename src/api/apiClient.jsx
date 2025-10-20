// src/api/apiClient.js
const API_BASE_URL = "http://localhost:3000/api";

/**
 * Helper untuk request API JSON (non-file)
 * @param {string} endpoint - endpoint API (misal "/login")
 * @param {object} options - opsi seperti method, body, headers, credentials
 */

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // otomatis kirim token
    },
    credentials: options.credentials || "include",
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 🔒 Deteksi token invalid atau expired
    if (response.status === 401 || response.status === 403) {
      console.warn("⚠️ Token tidak valid, expired, atau tidak diizinkan");

      // Bersihkan localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect otomatis ke halaman login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new Error("Sesi login berakhir. Silakan login kembali.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Terjadi kesalahan pada server");
    }

    return data;
  } catch (err) {
    console.error("apiClient error:", err);
    throw err;
  }
};