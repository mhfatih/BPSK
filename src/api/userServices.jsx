import { apiClient } from "./apiClient";

export const getUsers = async () => {
    return apiClient("/users", {
      method: "GET",
      credentials: "include",
    });
  };
  
  export const createUser = async (body) => {
    return apiClient("/users", {
      method: "POST",
      credentials: "include",
      body,
    });
  };
  
  export const updateUser = async (id, body) => {
    return apiClient(`/users/${id}`, {
      method: "PUT",
      credentials: "include",
      body,
    });
  };
  
  export const deleteUser = async (id) => {
    return apiClient(`/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  };