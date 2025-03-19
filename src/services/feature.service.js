const {
  Feature,
  Specification,
  FeatureOption,
  StandardUnit,
} = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const { uploadFiles } = require('../utils/fileUpload');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');

const getFeatureIdAndSpecIdByName = async (name) => {
  const feature = await Feature.findOne({
    where: { features_name: { [Op.like]: name } },
    attributes: ['feature_id', 'spec_id'],
  });
  return {
    feature_id: feature?.feature_id,
    spec_id: feature?.spec_id,
  };
};

const getAllFeatureNames = async () => {
  const features = await Feature.findAll({
    raw: true,
    attributes: ['features_name'],
  });
  return features;
};

const isFeatureTaken = async (name) => {
  try {
    return (await Feature.count({ where: { features_name: name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createFeature = async (user, featureBody, featureFiles) => {
  try {
    if (await isFeatureTaken(featureBody.features_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Feature already exists');
    }
    const feature = await Feature.create({
      ...featureBody,
    });

    await uploadFiles([
      {
        buffer: featureFiles.features_image[0].buffer,
        filename: `/feature/${feature.feature_id}/${feature.feature_id}.svg`,
        contentType: 'image/svg',
      },
    ]);
    return feature
      .set({
        features_image: `${feature.feature_id}.svg`,
      })
      .save();
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryFeatures = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: Specification,
        as: 'specification',
        attributes: ['spec_name'],
      },
      {
        model: FeatureOption,
        as: 'featureOption',
        attributes: ['fo_value'],
      },
      { model: StandardUnit, as: 'standardUnit', attributes: ['su_name'] },
    ];
    const features = await Feature.findAndCountAll(queryOptions);
    return formatQueryResult(features, query);
  } catch (error) {
    console.error('Error in queryFeatures:', error);
    throw error;
  }
};

const deleteFeature = async (uuid) => {
  return Feature.destroy({ where: { uuid } });
};

const getFeatureByUuid = async (uuid) => {
  return Feature.findOne({ where: { uuid } });
};

const toggleFeatureStatus = async (uuid) => {
  const feature = await Feature.findOne({ where: { uuid } });
  if (!feature) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feature not found');
  }
  feature.status = !feature.status;
  return feature.save();
};

const updateFeature = async (uuid, featureBody, featureFiles) => {
  const feature = await Feature.findOne({ where: { uuid } });
  if (!feature) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feature not found');
  }

  if (featureFiles.features_image) {
    await uploadFiles([
      {
        buffer: featureFiles.features_image[0].buffer,
        filename: `/feature/${feature.feature_id}/${feature.feature_id}.svg`,
        contentType: 'image/svg',
      },
    ]);
  }
  return feature
    .set({
      ...featureBody,
      features_image: `${feature.feature_id}.svg`,
    })
    .save();
};

module.exports = {
  createFeature,
  queryFeatures,
  deleteFeature,
  getFeatureByUuid,
  toggleFeatureStatus,
  updateFeature,
  getFeatureIdAndSpecIdByName,
  getAllFeatureNames,
};
