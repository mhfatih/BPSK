import * as rolePermissionRepo from "../modules/rolePermission/repository/repository.js";

export const permission = (requiredPermission) => {
  return async (req, res, next) => {
    const roles = req.user?.roles || [];
    if (!roles.length) return res.status(403).json({ message: "Forbidden" });

    const permissions = [];
    for (const role of roles) {
      const rolePerms = await rolePermissionRepo.getRelations(role.role_id);
      permissions.push(...rolePerms.map(permission => permission.permission_name));
    }

    const uniquePermissions = [...new Set(permissions)];

    if (!uniquePermissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
