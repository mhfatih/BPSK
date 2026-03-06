// utils/string.util.js
export const toKebabCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
