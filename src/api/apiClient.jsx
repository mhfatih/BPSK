const API_BASE_URL = "http://localhost:3000/api";

/**
 * Helper universal untuk request API
 * Bisa digunakan untuk:
 * - Request JSON biasa
 * - Upload file menggunakan FormData
 *
 * @param {string} endpoint - contoh: "/upload" atau "/login"
 * @param {object} options - opsi fetch seperti method, body, headers, credentials
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    credentials: options.credentials || "include",
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  // 🔍 Deteksi otomatis apakah body berupa FormData atau JSON
  if (options.body) {
    if (options.body instanceof FormData) {
      config.body = options.body; // langsung pakai FormData
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 🔒 Token invalid atau expired
    if (response.status === 401 || response.status === 403) {
      console.warn("⚠️ Token tidak valid, expired, atau tidak diizinkan");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new Error("Sesi login berakhir. Silakan login kembali.");
    }

    // Parsing JSON kalau bisa
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
