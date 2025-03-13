const { RoleHasPermission, Permission } = require('../db/models');

const getPermissions = async (user) => {
  try {
    const permissions = await RoleHasPermission.findAll({
      where: { role_id: user.role_id },
      include: [{ model: Permission, as: 'permission', attributes: ['name'] }],
    });
    const permissionNames = permissions.map((p) => p.permission.name);
    return new Set(permissionNames);
  } catch (error) {
    return [];
  }
};

const isPermitted = async (user, permission) => {
  const permissions = await getPermissions(user);
  return permissions.has(permission);
};

const getAllPermissions = async () => {
  return Permission.findAll();
};

module.exports = {
  getPermissions,
  isPermitted,
  getAllPermissions,
};
