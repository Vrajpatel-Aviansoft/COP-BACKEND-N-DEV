const { FeatureOption } = require('../../db/models');

const getFeatureOptions = async () => {
  return FeatureOption.findAll();
};

module.exports = {
  getFeatureOptions,
};
