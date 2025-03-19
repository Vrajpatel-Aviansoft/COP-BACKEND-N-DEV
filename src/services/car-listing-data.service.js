const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Brand, CarModel, CarListingData, CarListing } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');

const getCarListing = async () => {
  return CarListing.findAll();
};

const createCarListingData = async (body, user) => {
  try {
    await CarListingData.create({
      ...body,
      status: body.status === 'on',
      created_by: user.id,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryCarListingData = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: Brand,
        attributes: ['brand_name'],
        as: 'brand',
      },
      {
        model: CarModel,
        attributes: ['model_name'],
        as: 'model',
      },
      {
        model: CarListing,
        attributes: ['cl_name'],
        as: 'car_listing',
      },
    ];
    const carListingData = await CarListingData.findAndCountAll(queryOptions);
    return formatQueryResult(carListingData, query);
  } catch (error) {
    console.error('Error in queryCarListingData:', error);
    throw error;
  }
};

const getCarListingDataByUuid = async (uuid) => {
  return CarListingData.findOne({
    where: { uuid },
    raw: true,
    include: [
      {
        model: CarModel,
        attributes: ['model_name'],
        as: 'model',
      },
      {
        model: Brand,
        attributes: ['brand_name'],
        as: 'brand',
      },
      {
        model: CarListing,
        attributes: ['cl_name'],
        as: 'car_listing',
      },
    ],
  });
};

const updateCarListingData = async (uuid, body, user) => {
  try {
    const carListingData = await CarListingData.findOne({ where: { uuid } });
    carListingData.update({
      ...body,
      status: body.status === 'on',
      updated_by: user.id,
    });
    return carListingData;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const toggleStatus = async (uuid) => {
  const carListingData = await CarListingData.findOne({ where: { uuid } });
  carListingData.status = !carListingData.status;
  return carListingData.save();
};

const deleteCarListingData = async (uuid) => {
  return CarListingData.destroy({ where: { uuid } });
};

module.exports = {
  getCarListing,
  createCarListingData,
  queryCarListingData,
  getCarListingDataByUuid,
  updateCarListingData,
  deleteCarListingData,
  toggleStatus,
};
