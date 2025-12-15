
export const buildFileUrl = (path) => {
  if (!path) return null;

  const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${base}${path}`;
};