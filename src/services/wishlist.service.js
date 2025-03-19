const {
  Wishlist,
  Brand,
  CarModel,
  WebsiteCustomer,
  City,
} = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');

const queryWishlist = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: CarModel,
        as: 'model',
        attributes: ['model_name'],
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['brand_name'],
          },
        ],
      },
      {
        model: WebsiteCustomer,
        as: 'websitecustomer',
        attributes: ['first_name', 'last_name', 'contact_no', 'city_id'],
        include: [
          {
            model: City,
            as: 'city',
            attributes: ['city_name'],
          },
        ],
      },
    ];
    const wishlists = await Wishlist.findAndCountAll(queryOptions);
    return formatQueryResult(wishlists, query);
  } catch (error) {
    console.error('Error in querywishlists:', error);
    throw error;
  }
};

module.exports = {
  queryWishlist,
};
