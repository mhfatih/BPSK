// src/api/authService.js
import { apiClient } from "./apiClient";

export const login = async (email, password, role, recaptchaToken) => {
  return apiClient("/login", {
    method: "POST",
    body: { email, password, role, recaptchaToken },
  });
};

export const register = async (nama_lengkap, email, password, confirm_password) => {
  return apiClient("/register", {
    method: "POST",
    body: { nama_lengkap, email, password, confirm_password },
  });
};

export const logout = async () => {
  return apiClient("/logout", {
    method: "POST",
    credentials: "include",
  });
};