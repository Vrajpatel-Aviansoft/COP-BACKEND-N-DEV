const { FuelStation, State, City } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { seedService } = require('.');
const {
  fuelStationColumns,
} = require('../validations/imports/columns/station-cols');

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

const isfuelStationTaken = async (name) => {
  try {
    return (await FuelStation.count({ where: { f_station_name: name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createFuelStation = async (user, fuelStationBody) => {
  try {
    if (await isfuelStationTaken(fuelStationBody.f_station_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Fuel station already exists');
    }
    const fuelStation = await FuelStation.create({
      ...fuelStationBody,
      created_by: user.id,
    });

    return fuelStation.save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryFuelStaions = async (query) => {
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
    const fuelStations = await FuelStation.findAndCountAll(queryOptions);
    return formatQueryResult(fuelStations, query);
  } catch (error) {
    console.error('Error in queryfuelStations:', error);
    throw error;
  }
};

const deleteFuelStation = async (uuid) => {
  return FuelStation.destroy({ where: { uuid } });
};

const getFuelStationByUuid = async (uuid) => {
  return FuelStation.findOne({ where: { uuid } });
};

const toggleFuelStationStatus = async (uuid) => {
  const fuelStation = await FuelStation.findOne({ where: { uuid } });
  if (!fuelStation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ev Station not found');
  }
  fuelStation.status = !fuelStation.status;
  return fuelStation.save();
};

const updateFuelStation = async (uuid, fuelStationBody) => {
  try {
    const fuelStation = await FuelStation.findOne({ where: { uuid } });
    if (!fuelStation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Fuel Station not found');
    }

    await fuelStation.update(fuelStationBody);

    return fuelStation;
  } catch (error) {
    console.error('Error in update Fuel Station:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching features for the specs'
    );
  }
};

const bulkCreateFuelStation = async (user, rows) => {
  try {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const state_id = await seedService.getStateIdByName(
        row[fuelStationColumns.STATE]
      );
      if (!state_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
      }
      const city_id = await seedService.getCityIdByName(
        row[fuelStationColumns.CITY]
      );
      if (!city_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'City not found');
      }
      await createFuelStation(user, {
        f_station_name: row[fuelStationColumns.FUEL_STATION_NAME],
        f_station_address: row[fuelStationColumns.ADDRESS],
        f_station_location: row[fuelStationColumns.LOCATION],
        contact_no: row[fuelStationColumns.CONTACT_NO],
        state_id,
        city_id,
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createFuelStation,
  queryFuelStaions,
  getCitiesByState,
  deleteFuelStation,
  getFuelStationByUuid,
  toggleFuelStationStatus,
  updateFuelStation,
  bulkCreateFuelStation,
};
