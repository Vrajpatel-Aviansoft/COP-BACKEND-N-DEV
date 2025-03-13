const { User, Role } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const isuserTaken = async (email) => {
  try {
    return (await User.count({ where: { email } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const getUserByUuid = async (uuid) => {
  return User.findOne({ where: { uuid } });
};

const createUser = async (userBody) => {
  try {
    if (await isuserTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }
    const user = await User.create(userBody);

    return user.save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryUser = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: Role,
        as: 'role',
        attributes: ['name'],
      },
    ];
    const users = await User.findAndCountAll(queryOptions);
    return formatQueryResult(users, query);
  } catch (error) {
    console.error('Error in queryusers:', error);
    throw error;
  }
};

const deleteUser = async (uuid) => {
  return User.destroy({ where: { uuid } });
};

const getUserById = async (id) => {
  return User.findByPk(id);
};

const editUser = async (uuid, userBody) => {
  return User.update(userBody, {
    where: { uuid },
  });
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const updateUser = async (uuid, userBody) => {
  try {
    const user = await User.findOne({ where: { uuid } });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await user.update(userBody);

    return user;
  } catch (error) {
    console.error('Error in update User:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching features for the specs'
    );
  }
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByUuid,
  deleteUser,
  editUser,
  updateUser,
};
