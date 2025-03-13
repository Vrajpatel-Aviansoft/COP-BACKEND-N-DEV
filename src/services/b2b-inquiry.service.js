const { B2BInquiry } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');

const queryB2BInquiry = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [];
    const b2binquirys = await B2BInquiry.findAndCountAll(queryOptions);
    return formatQueryResult(b2binquirys, query);
  } catch (error) {
    console.error('Error in queryb2binquirys:', error);
    throw error;
  }
};

module.exports = {
  queryB2BInquiry,
};
