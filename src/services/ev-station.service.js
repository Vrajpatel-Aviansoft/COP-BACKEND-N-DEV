const { EvStation, State, City } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');

const getCitiesByState = async (stateId) => {
  try {
    return await City.findAll({ where: { state_id: stateId } });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching cities for the state'
    );
  }
};

const isevStationTaken = async (evs_name) => {
  try {
    return (await EvStation.count({ where: { evs_name: evs_name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createEvStation = async (user, evStationBody) => {
  try {
    if (await isevStationTaken(evStationBody.evs_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'EV station already exists');
    }
    const evStation = await EvStation.create({
      ...evStationBody,
      created_by: user.id,
    });

    return evStation.save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryEvStaions = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: State,
        as: 'state',
        attributes: ['state_name'],
      },
      {
        model: City,
        as: 'city',
        attributes: ['city_name'],
      },
    ];
    const evStations = await EvStation.findAndCountAll(queryOptions);
    return formatQueryResult(evStations, query);
  } catch (error) {
    console.error('Error in queryevStations:', error);
    throw error;
  }
};

const deleteEvStation = async (uuid) => {
  return EvStation.destroy({ where: { uuid } });
};

const getEvStationByUuid = async (uuid) => {
  return EvStation.findOne({ where: { uuid } });
};

const toggleEvStationStatus = async (uuid) => {
  const evStation = await EvStation.findOne({ where: { uuid } });
  if (!evStation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ev Station not found');
  }
  evStation.status = !evStation.status;
  return evStation.save();
};

const updateEvStation = async (uuid, evStationBody) => {
  try {
    const evStation = await EvStation.findOne({ where: { uuid } });
    if (!evStation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'EV Station not found');
    }

    await evStation.update(evStationBody);

    return evStation;
  } catch (error) {
    console.error('Error in update EV Station:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching features for the specs'
    );
  }
};

module.exports = {
  createEvStation,
  queryEvStaions,
  getCitiesByState,
  deleteEvStation,
  getEvStationByUuid,
  toggleEvStationStatus,
  updateEvStation,
};
