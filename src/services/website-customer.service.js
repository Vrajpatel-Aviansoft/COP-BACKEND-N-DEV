const { WebsiteCustomer, City } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');

const queryWebsiteCustomer = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: City,
        as: 'city',
        attributes: ['city_name'],
      },
    ];
    const websiteCustomers = await WebsiteCustomer.findAndCountAll(
      queryOptions
    );
    return formatQueryResult(websiteCustomers, query);
  } catch (error) {
    console.error('Error in querywebsiteCustomers:', error);
    throw error;
  }
};

module.exports = {
  queryWebsiteCustomer,
};
