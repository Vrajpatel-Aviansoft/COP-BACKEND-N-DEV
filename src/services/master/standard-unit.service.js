const { StandardUnit } = require('../../db/models');

const getStandardUnits = async () => {
  return StandardUnit.findAll();
};

module.exports = {
  getStandardUnits,
};
