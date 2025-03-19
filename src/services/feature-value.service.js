const {
  FeatureValue,
  CarModel,
  Brand,
  Variant,
  Feature,
} = require('../db/models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const {
  featureValueColumns,
} = require('../validations/imports/columns/feature-value-cols');
const {
  brandService,
  carModelService,
  variantService,
  featureService,
} = require('.');

const getModelsByBrand = async (uuid) => {
  try {
    return CarModel.findAll({
      include: [
        {
          model: Brand,
          as: 'brand',
          where: { uuid: uuid },
        },
      ],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching models for the brand'
    );
  }
};

const getVariantsByModel = async (uuid) => {
  try {
    return Variant.findAll({
      include: [
        {
          model: CarModel,
          as: 'model',
          where: { uuid: uuid },
        },
      ],
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching models for the brand'
    );
  }
};

const createFeatureValue = async (user, featureBody) => {
  try {
    const {
      brand_id,
      model_id,
      variant_id,
      spec_id,
      feature_value,
      key_highlight,
    } = featureBody;

    for (const featureId in feature_value) {
      const value = feature_value[featureId];
      const highlight = key_highlight[featureId];

      const existingFeature = await Feature.findOne({
        where: { feature_id: featureId },
      });

      if (!existingFeature) continue;

      if (value) {
        const existingFeatureValue = await FeatureValue.findOne({
          where: { feature_id: featureId, brand_id, model_id, variant_id },
        });

        if (existingFeatureValue) {
          existingFeatureValue.feature_value = value;
          existingFeatureValue.key_highlight = highlight;
          existingFeatureValue.updated_by = user.id;
          await existingFeatureValue.save();
        } else {
          await FeatureValue.create({
            spec_id,
            feature_id: featureId,
            feature_value: value,
            brand_id,
            model_id,
            variant_id,
            value,
            key_highlight: highlight,
            created_by: user.id,
          });
        }
      }
    }
    return { message: 'Feature values processed successfully' };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const getUniqueFeatureValue = async (params) => {
  return FeatureValue.findOne({
    raw: true,
    where: { ...params },
  });
};

const bulkCreateFeatureValue = async (user, rows) => {
  try {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const brand_id = await brandService.getBrandIdByName(
        row[featureValueColumns.BRAND_NAME]
      );

      if (!brand_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
      }

      const model_id = await carModelService.getModelIdByBrandIdAndName(
        row[featureValueColumns.MODEL_NAME],
        brand_id
      );

      if (!model_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
      }

      const variant_id = await variantService.getVariantIdByModelIdAndName(
        row[featureValueColumns.VARIANT_NAME],
        model_id
      );

      if (!variant_id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Variant not found');
      }

      const allFeatures = await featureService.getAllFeatureNames();

      for (let j = 0; j < allFeatures.length; j++) {
        const currentFeature = allFeatures[j];
        const featureName = currentFeature.features_name
          .toLowerCase()
          .replace(/_/g, ' ');
        const { feature_id, spec_id } =
          await featureService.getFeatureIdAndSpecIdByName(featureName);
        const feature_value = row[currentFeature.features_name];

        const existingFeatureValue = await getUniqueFeatureValue({
          brand_id,
          model_id,
          variant_id,
          spec_id,
          feature_id,
        });

        if (existingFeatureValue && !feature_value) {
          await deleteFeatureValue({
            brand_id,
            model_id,
            variant_id,
            spec_id,
            feature_id,
          });
        }

        if (!existingFeatureValue && feature_value) {
          await FeatureValue.create({
            brand_id,
            model_id,
            variant_id,
            spec_id,
            feature_id,
            feature_value,
            created_by: user.id,
          });
        }

        if (existingFeatureValue && feature_value) {
          await FeatureValue.update(
            {
              feature_value,
              updated_by: user.id,
            },
            {
              where: {
                brand_id,
                model_id,
                variant_id,
                spec_id,
                feature_id,
              },
            }
          );
        }
      }
    }
  } catch (error) {
    throw new Error('Feature import failed');
  }
};

const deleteFeatureValue = async (params) => {
  await FeatureValue.destroy({
    where: { ...params },
  });
};

module.exports = {
  getModelsByBrand,
  getVariantsByModel,
  createFeatureValue,
  bulkCreateFeatureValue,
};
