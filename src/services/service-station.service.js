const {
  ServiceStation,
  State,
  City,
  Brand,
  EvStation,
} = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const {
  serviceStationColumns,
} = require('../validations/imports/columns/service-station-cols');
const { seedService, brandService } = require('.');

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

const isserviceStationTaken = async (name) => {
  try {
    return (
      (await ServiceStation.count({ where: { s_station_name: name } })) > 0
    );
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createServiceStation = async (user, ServiceStationBody) => {
  try {
    if (await isserviceStationTaken(ServiceStationBody.s_station_name)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Service station already exists'
      );
    }
    const serviceStation = await ServiceStation.create({
      ...ServiceStationBody,
      created_by: user.id,
    });

    return serviceStation.save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryServiceStations = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: Brand,
        as: 'brand',
        attributes: ['brand_name'],
      },
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
    const ServiceStations = await ServiceStation.findAndCountAll(queryOptions);
    return formatQueryResult(ServiceStations, query);
  } catch (error) {
    console.error('Error in queryServiceStations:', error);
    throw error;
  }
};

const deleteServiceStation = async (uuid) => {
  return ServiceStation.destroy({ where: { uuid } });
};

const getServiceStationByUuid = async (uuid) => {
  return ServiceStation.findOne({ where: { uuid } });
};

const toggleServiceStationStatus = async (uuid) => {
  const serviceStation = await ServiceStation.findOne({ where: { uuid } });
  if (!serviceStation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Station not found');
  }
  serviceStation.status = !serviceStation.status;
  return serviceStation.save();
};

const updateServiceStation = async (uuid, serviceStationBody) => {
  try {
    const serviceStation = await ServiceStation.findOne({ where: { uuid } });
    if (!serviceStation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Service Station not found');
    }

    await serviceStation.update(serviceStationBody);

    return serviceStation;
  } catch (error) {
    console.error('Error in update Service Station:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching features for the specs'
    );
  }
};

const bulkCreateServiceStation = async (user, rows) => {
  try {
    let ServiceStationBody = {};
    for (let i = 0; i < rows.length; i++) {
      const ServiceStation = rows[i];

      const brand_id = await brandService.getBrandIdByName(
        ServiceStation[serviceStationColumns.BRAND_NAME]
      );
      if (!brand_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
      }

      const state_id = await seedService.getStateIdByName(
        ServiceStation[serviceStationColumns.STATE]
      );
      if (!state_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
      }

      const city_id = await seedService.getCityIdByName(
        ServiceStation[serviceStationColumns.CITY]
      );
      if (!city_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'City not found');
      }

      ServiceStationBody = {
        brand_id: brand_id,
        state_id: state_id,
        city_id: city_id,
        s_station_name:
          ServiceStation[serviceStationColumns.SERVICE_STATION_NAME],
        s_station_address: ServiceStation[serviceStationColumns.ADDRESS],
        contact_no: ServiceStation[serviceStationColumns.CONTACT_NO],
        s_station_location: ServiceStation[serviceStationColumns.LOCATION],
        email: ServiceStation[serviceStationColumns.EMAIL],
        created_by: user.id,
      };
      await createServiceStation(user, ServiceStationBody);
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

module.exports = {
  createServiceStation,
  queryServiceStations,
  getCitiesByState,
  deleteServiceStation,
  getServiceStationByUuid,
  toggleServiceStationStatus,
  updateServiceStation,
  bulkCreateServiceStation,
};
