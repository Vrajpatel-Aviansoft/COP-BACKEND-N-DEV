const { ServicesLead, Brand, CarModel, City } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');

const queryServicesLead = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: Brand,
        as: 'brand',
        attributes: ['brand_name'],
      },
      {
        model: CarModel,
        as: 'model',
        attributes: ['model_name'],
      },
      {
        model: City,
        as: 'city',
        attributes: ['city_name'],
      },
    ];

    const whereConditions = {};
    if (query.tab === 'I') {
      whereConditions.category = 'I';
    } else if (query.tab === 'L') {
      whereConditions.category = 'L';
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid tab provided');
    }
    queryOptions.where = whereConditions;

    const servicesLeads = await ServicesLead.findAndCountAll(queryOptions);

    return formatQueryResult(servicesLeads, query);
  } catch (error) {
    console.error('Error in queryServicesLeads:', error);
    throw error;
  }
};

module.exports = {
  queryServicesLead,
};
