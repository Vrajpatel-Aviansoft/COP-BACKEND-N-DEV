const { CarType } = require('../../db/models');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../../utils/queryHelper');
const { Op } = require('sequelize');

const getCarTypeIdByName = async (name) => {
  const ct = await CarType.findOne({
    where: { ct_name: { [Op.like]: name } },
    raw: true,
    attributes: ['ct_id'],
  });
  return ct?.ct_id;
};

const isCarTypeTaken = async (name) => {
  const count = await CarType.count({ where: { ct_name: name } });
  return count > 0;
};

const createCarType = async (carTypeBody) => {
  if (await isCarTypeTaken(carTypeBody.ct_name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Car type already taken');
  }
  return CarType.create(carTypeBody);
};

const queryCarTypes = async (query) => {
  const queryOptions = buildQueryOptions(query);
  const carTypes = await CarType.findAndCountAll(queryOptions);
  return formatQueryResult(carTypes, query);
};

const deleteCarType = async (uuid) => {
  return CarType.destroy({ where: { uuid } });
};

const getCarTypeByUuid = async (uuid) => {
  return CarType.findOne({ where: { uuid } });
};

const editCarType = async (uuid, carTypeBody) => {
  return CarType.update(carTypeBody, {
    where: { uuid },
  });
};

const getIdFromUuid = async (uuid) => {
  const carType = await CarType.findOne({
    attributes: ['ct_id'],
    where: { uuid },
  });
  return carType.ct_id;
};

module.exports = {
  createCarType,
  isCarTypeTaken,
  queryCarTypes,
  deleteCarType,
  getCarTypeByUuid,
  editCarType,
  getIdFromUuid,
  getCarTypeIdByName,
};
