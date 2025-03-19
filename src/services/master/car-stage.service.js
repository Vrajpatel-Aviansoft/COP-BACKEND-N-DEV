const { CarStage } = require('../../db/models');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../../utils/queryHelper');

const isCarStageTaken = async (name) => {
  return (await CarStage.count({ where: { cs_name: name } })) > 0;
};

const createCarStage = async (carStageBody) => {
  if (await isCarStageTaken(carStageBody.cs_name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Car stage already taken');
  }
  return CarStage.create(carStageBody);
};

const queryCarStages = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    const carStages = await CarStage.findAndCountAll(queryOptions);
    return formatQueryResult(carStages, query);
  } catch (error) {
    throw error;
  }
};

const deleteCarStage = async (uuid) => {
  return CarStage.destroy({ where: { uuid } });
};

const getCarStageByUuid = async (uuid) => {
  return CarStage.findOne({ where: { uuid } });
};

const editCarStage = async (uuid, carStageBody) => {
  return CarStage.update(carStageBody, {
    where: { uuid },
  });
};

const getIdFromUuid = async (uuid) => {
  const carStage = await CarStage.findOne({
    attributes: ['cs_id'],
    where: { uuid },
  });
  return carStage.cs_id;
};

module.exports = {
  createCarStage,
  isCarStageTaken,
  queryCarStages,
  deleteCarStage,
  getCarStageByUuid,
  editCarStage,
  getIdFromUuid,
};
