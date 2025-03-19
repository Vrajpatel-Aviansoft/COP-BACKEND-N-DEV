const { Role, RoleHasPermission } = require('../db/models');
const { permissionService } = require('../services');

const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const isRoleTaken = async (name) => {
  try {
    return (await Role.count({ where: { name: name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const getRoleByUuid = async (uuid) => {
  return Role.findOne({ where: { uuid } });
};

const createRole = async (user, roleBody) => {
  const { role_name, permission_id: permissionIds } = roleBody;

  try {
    if (await isRoleTaken(role_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Role already exists');
    }

    const role = await Role.create({
      name: role_name,
      guard_name: 'web',
      created_at: user.id,
      updated_at: user.id,
    });

    if (Array.isArray(permissionIds) && permissionIds.length > 0) {
      const validPermissions = await permissionService.getAllPermissions({
        where: { id: permissionIds },
        attributes: ['id'],
      });

      const validPermissionIds = validPermissions.map(
        (permission) => permission.id
      );

      const rolePermissions = validPermissionIds.map((permissionId) => ({
        role_id: role.id,
        permission_id: permissionId,
      }));

      if (rolePermissions.length > 0) {
        await RoleHasPermission.bulkCreate(rolePermissions);
      } else {
        console.warn('No valid permissions to associate with the role.');
      }
    }

    return role;
  } catch (error) {
    // await transaction.rollback();
    console.error('Error creating role:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryRoles = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    const roles = await Role.findAndCountAll(queryOptions);
    return formatQueryResult(roles, query);
  } catch (error) {
    console.error('Error in queryRoles:', error);
    throw error;
  }
};

const deleteRole = async (uuid) => {
  return await Role.destroy({ where: { uuid } });
};

const getRoleById = async (id) => {
  return await Role.findByPk(id);
};

const editRole = async (uuid, roleBody) => {
  return Role.update(roleBody, {
    where: { uuid },
  });
};

const updateRole = async (uuid, roleBody) => {
  try {
    const role = await Role.findOne({ where: { uuid } });
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }

    await role.update(roleBody);

    return role;
  } catch (error) {
    console.error('Error in update Role:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching features for the specs'
    );
  }
};

const getIdFromUuid = async (uuid) => {
  return Role.findOne({ where: { uuid } });
};

const getRoles = async () => {
  return Role.findAll();
};

module.exports = {
  createRole,
  isRoleTaken,
  queryRoles,
  deleteRole,
  getRoleById,
  editRole,
  getRoleByUuid,
  updateRole,
  getIdFromUuid,
  getRoles,
};
