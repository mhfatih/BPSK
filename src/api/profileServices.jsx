import { apiClient } from "./apiClient";

// Ambil profil user sendiri
export const getProfile = async () => {
  return apiClient("/profile", {
    method: "GET",
    credentials: "include",
  });
  
};

// Update profil user
export const updateProfile = async (formData) => {
  return apiClient("/profile", {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
};