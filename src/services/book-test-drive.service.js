const {
  BookTestDrive,
  Brand,
  CarModel,
  DealerShip,
  WebsiteCustomer,
} = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');

const queryBookTestDrive = async (query) => {
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
        model: DealerShip,
        as: 'dealership',
        attributes: ['dealer_name', 'address'],
      },
      {
        model: WebsiteCustomer,
        as: 'websitecustomer',
        attributes: ['contact_no'],
      },
    ];
    const testDrives = await BookTestDrive.findAndCountAll(queryOptions);
    return formatQueryResult(testDrives, query);
  } catch (error) {
    console.error('Error in queryBookTestDrives:', error);
    throw error;
  }
};

module.exports = {
  queryBookTestDrive,
};
