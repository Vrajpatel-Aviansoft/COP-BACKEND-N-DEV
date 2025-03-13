const { Subscribe } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const querySubscribe = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [];
    const subscribes = await Subscribe.findAndCountAll(queryOptions);
    return formatQueryResult(subscribes, query);
  } catch (error) {
    console.error('Error in querysubscribes:', error);
    throw error;
  }
};

const deleteSubscribe = async (uuid) => {
  return Subscribe.destroy({ where: { uuid } });
};

module.exports = {
  querySubscribe,
  deleteSubscribe,
};
