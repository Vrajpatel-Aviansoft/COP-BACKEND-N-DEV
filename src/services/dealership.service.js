const { DealerShip, Brand, State, City } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const {
  dealerShipColumns,
} = require('../validations/imports/columns/dealership-cols');
const { brandService, seedService } = require('.');

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

const isdealerShipTaken = async (name) => {
  try {
    return (await DealerShip.count({ where: { company_name: name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const getDealerShipByUuid = async (uuid) => {
  return DealerShip.findOne({ where: { uuid } });
};

const createDealerShip = async (user, dealerShipBody) => {
  try {
    if (await isdealerShipTaken(dealerShipBody.company_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Dealership already exists');
    }
    const dealerShip = await DealerShip.create({
      ...dealerShipBody,
      created_by: user.id,
      updated_by: user.id,
    });
    return dealerShip.save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryDealerShip = async (query) => {
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
    const dealerShips = await DealerShip.findAndCountAll(queryOptions);
    return formatQueryResult(dealerShips, query);
  } catch (error) {
    console.error('Error in querydealerShips:', error);
    throw error;
  }
};

const deleteDealerShip = async (uuid) => {
  return DealerShip.destroy({ where: { uuid } });
};

const getDealerShipById = async (id) => {
  return DealerShip.findByPk(id);
};

const editDealerShip = async (uuid, dealerShipBody) => {
  return DealerShip.update(dealerShipBody, {
    where: { uuid },
  });
};

const toggleDealerShipStatus = async (uuid) => {
  const dealerShip = await DealerShip.findOne({ where: { uuid } });
  if (!dealerShip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dealership not found');
  }
  dealerShip.status = !dealerShip.status;
  return dealerShip.save();
};

const updateDealerShip = async (uuid, dealerShipBody) => {
  try {
    const dealerShip = await DealerShip.findOne({ where: { uuid } });
    if (!dealerShip) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Dealership not found');
    }
    await dealerShip.update(dealerShipBody);
    return dealerShip;
  } catch (error) {
    console.error('Error in update Dealership:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching features for the specs'
    );
  }
};

const bulkCreateDealership = async (user, rows) => {
  try {
    let dealerShipBody = {};
    for (let i = 0; i < rows.length; i++) {
      const dealerShip = rows[i];
      const brand_id = await brandService.getBrandIdByName(
        dealerShip[dealerShipColumns.BRAND_NAME]
      );
      if (!brand_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
      }
      const state_id = await seedService.getStateIdByName(
        dealerShip[dealerShipColumns.STATE]
      );
      if (!state_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
      }
      const city_id = await seedService.getCityIdByName(
        dealerShip[dealerShipColumns.CITY]
      );
      if (!city_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'City not found');
      }
      dealerShipBody = {
        brand_id: brand_id,
        state_id: state_id,
        city_id: city_id,
        company_name: dealerShip[dealerShipColumns.COMPANY],
        dealer_name: dealerShip[dealerShipColumns.DEALER],
        address: dealerShip[dealerShipColumns.ADDRESS],
        phone_no: dealerShip[dealerShipColumns.CONTACT_NO],
        map_location: dealerShip[dealerShipColumns.LOCATION],
        email: dealerShip[dealerShipColumns.EMAIL],
      };
      await createDealerShip(user, dealerShipBody);
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

module.exports = {
  createDealerShip,
  queryDealerShip,
  getCitiesByState,
  deleteDealerShip,
  getDealerShipById,
  editDealerShip,
  getDealerShipByUuid,
  toggleDealerShipStatus,
  updateDealerShip,
  bulkCreateDealership,
};
