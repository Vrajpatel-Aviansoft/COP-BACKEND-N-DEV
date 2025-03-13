const { Rto, State } = require('../../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../../utils/queryHelper');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const getRtoByUuid = async (uuid) => {
  return Rto.findOne({ where: { uuid } });
};

const createRto = async (user, rtoBody) => {
  try {
    const rto = await Rto.create({
      ...rtoBody,
      created_at: user.id,
      updated_at: user.id,
    });

    return rto.save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryRto = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: State,
        as: 'state',
        attributes: ['state_name'],
      },
    ];
    const rtos = await Rto.findAndCountAll(queryOptions);
    return formatQueryResult(rtos, query);
  } catch (error) {
    console.error('Error in queryRtos:', error);
    throw error;
  }
};

const deleteRto = async (uuid) => {
  return Rto.destroy({ where: { uuid } });
};

const getRtoById = async (id) => {
  return Rto.findByPk(id);
};

const editRto = async (uuid, rtoBody) => {
  return Rto.update(rtoBody, {
    where: { uuid },
  });
};

const updateRto = async (uuid, rtoBody) => {
  try {
    const rto = await Rto.findOne({ where: { uuid } });
    if (!rto) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Rto not found');
    }

    await rto.update(rtoBody);

    return rto;
  } catch (error) {
    console.error('Error in update Rto:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching Rto');
  }
};

module.exports = {
  createRto,
  queryRto,
  deleteRto,
  getRtoById,
  editRto,
  getRtoByUuid,
  updateRto,
};
