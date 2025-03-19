const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Variant, Color, Brand, CarModel } = require('../db/models');
const { uploadFiles } = require('../utils/fileUpload');
const { default: axios } = require('axios');
const { Op, Sequelize } = require('sequelize');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const delay = require('../utils/delay');
const { moveObject, deleteObjects } = require('../config/minio');
const { variantFileTransformer } = require('../utils/helpers');
const {
  variantColumns,
  variantColorColumns,
} = require('../validations/imports/columns/variant-cols');
const { brandService } = require('.');
const carModelService = require('./car-model.service');

const getModelsByBrand = async (brandId) => {
  try {
    return await CarModel.findAll({ where: { brand_id: brandId } });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching models for the brand'
    );
  }
};

const getVariantIdByModelIdAndName = async (variantName, modelId) => {
  const variant = await Variant.findOne({
    raw: true,
    where: {
      model_id: modelId,
      variant_name: { [Op.like]: variantName?.trim() },
    },
  });
  return variant?.variant_id;
};

const getVariantsByModel = async (modelId) => {
  return await Variant.findAll({
    where: { model_id: modelId },
    raw: true,
  });
};

const createVariant = async (body, files, user) => {
  try {
    const {
      brand_id,
      model_id,
      variant_name,
      variant_type,
      seating_capacity,
      kt_docs_repeater_basic,
      status,
    } = body;

    const transformedFiles = variantFileTransformer(files);

    const variant = await Variant.create({
      brand_id,
      model_id,
      variant_name,
      variant_type,
      seating_capacity,
      status: status === 'on',
      created_by: user.id,
    });

    const filePath = `/brand/${brand_id}/${model_id}`;
    const contentType = 'image/webp';

    const variantImageFileName = `${variant.variant_id}.webp`;
    const variantImageMobFileName = `${variant.variant_id}_mob.webp`;

    const variantImageUploadConfig = [
      {
        buffer: transformedFiles.variant_image.buffer,
        filename: `${filePath}/${variantImageFileName}`,
        contentType,
      },
      {
        buffer: transformedFiles.variant_image_mob.buffer,
        filename: `${filePath}/${variantImageMobFileName}`,
        contentType,
      },
    ];

    await uploadFiles(variantImageUploadConfig);

    variant.variant_image = variantImageFileName;
    variant.variant_image_mob = variantImageMobFileName;
    await variant.save();

    if (kt_docs_repeater_basic && kt_docs_repeater_basic.length) {
      const colors = [];
      for (let i = 0; i < kt_docs_repeater_basic.length; i++) {
        const currentColor = kt_docs_repeater_basic[i];
        await delay(1);
        const variantColorImageName = `${
          variant.variant_id
        }_${Date.now()}.webp`;
        await delay(1);
        const variantColorImageMobName = `${
          variant.variant_id
        }_${Date.now()}_mob.webp`;
        colors.push({
          brand_id,
          model_id,
          variant_id: variant.variant_id,
          color_name: currentColor.color_name,
          color_code: currentColor.color_code,
          dual_color_code: currentColor.dual_color_code,
          variant_color_image: variantColorImageName,
          variant_color_image_mob: variantColorImageMobName,
          created_by: user.id,
        });
      }

      const variantColorImageUploadConfig =
        transformedFiles.kt_docs_repeater_basic.variant_color_image.map(
          (image, index) => ({
            buffer: image.buffer,
            filename: `${filePath}/${colors[index].variant_color_image}`,
            contentType,
          })
        );

      const variantColorImageMobUploadConfig =
        transformedFiles.kt_docs_repeater_basic.variant_color_image_mob.map(
          (image, index) => ({
            buffer: image.buffer,
            filename: `${filePath}/${colors[index].variant_color_image_mob}`,
            contentType,
          })
        );

      await Promise.all([
        uploadFiles(variantColorImageUploadConfig),
        uploadFiles(variantColorImageMobUploadConfig),
      ]);
      await Color.bulkCreate(colors);
    }
    return variant;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryVariants = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: CarModel,
        attributes: ['model_name'],
        as: 'model',
        raw: true,
      },
      {
        model: Brand,
        attributes: ['brand_name'],
        as: 'brand',
        raw: true,
      },
    ];
    const variants = await Variant.findAndCountAll(queryOptions);
    return formatQueryResult(variants, query);
  } catch (error) {
    console.error('Error in queryVariants:', error);
    throw error;
  }
};

const getVariantByUuid = async (uuid) => {
  return Variant.findOne({
    where: { uuid },
    include: [
      {
        model: CarModel,
        attributes: ['model_name'],
        as: 'model',
      },
      {
        model: Brand,
        attributes: ['brand_name'],
        as: 'brand',
      },
      {
        model: Color,
        as: 'colors',
      },
    ],
  });
};

const updateVariant = async (uuid, body, files, user) => {
  try {
    const {
      brand_id,
      model_id,
      variant_name,
      variant_type,
      seating_capacity,
      kt_docs_repeater_basic,
      status,
    } = body;
    const transformedFiles = variantFileTransformer(files);

    const variant = await Variant.findOne({ where: { uuid } });

    if (!variant) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Variant not found');
    }

    if (Number(brand_id) !== Number(variant.brand_id)) {
      const oldFilePath = `brand/${variant.brand_id}/${variant.model_id}`;
      const newFilePath = `brand/${brand_id}/${model_id}`;
      await moveObject(oldFilePath, newFilePath);
    }

    await Variant.update(
      {
        brand_id,
        model_id,
        variant_name,
        variant_type,
        seating_capacity,
        status: status === 'on',
        created_by: user.id,
        updated_by: user.id,
      },
      { where: { uuid } }
    );

    const filePath = `/brand/${brand_id}/${model_id}`;
    const contentType = 'image/webp';

    const variantImageFileName = `${variant.variant_id}.webp`;
    const variantImageMobFileName = `${variant.variant_id}_mob.webp`;

    const variantImageUploadConfig = [];

    if (transformedFiles.variant_image) {
      variantImageUploadConfig.push({
        buffer: transformedFiles.variant_image.buffer,
        filename: `${filePath}/${variantImageFileName}`,
        contentType,
      });
    }

    if (transformedFiles.variant_image_mob) {
      variantImageUploadConfig.push({
        buffer: transformedFiles.variant_image_mob.buffer,
        filename: `${filePath}/${variantImageMobFileName}`,
        contentType,
      });
    }

    await uploadFiles(variantImageUploadConfig);
    if (kt_docs_repeater_basic && kt_docs_repeater_basic.length) {
      const colors = [];
      for (let i = 0; i < kt_docs_repeater_basic.length; i++) {
        const currentColor = kt_docs_repeater_basic[i];
        if (currentColor.variant_color_image_updated === '1') {
          const updatedFile =
            transformedFiles.kt_docs_repeater_basic.variant_color_image.shift();
          const variantColorImageUploadConfig = [
            {
              buffer: updatedFile.buffer,
              filename: `${filePath}/${currentColor.variant_color_image_name}`,
              contentType,
            },
          ];
          await uploadFiles(variantColorImageUploadConfig);
        }
        if (currentColor.variant_color_image_mob_updated === '1') {
          const updatedFile =
            transformedFiles.kt_docs_repeater_basic.variant_color_image_mob.shift();
          const variantColorImageUploadConfig = [
            {
              buffer: updatedFile.buffer,
              filename: `${filePath}/${currentColor.variant_color_image_mob_name}`,
              contentType,
            },
          ];
          await uploadFiles(variantColorImageUploadConfig);
        }
        colors.push({
          color_id: currentColor.color_id,
          brand_id,
          model_id,
          variant_id: variant.variant_id,
          color_name: currentColor.color_name,
          color_code: currentColor.color_code,
          dual_color_code: currentColor.dual_color_code,
          created_by: user.id,
          updated_by: user.id,
        });
      }
      const cleanedColors = colors.map((color) => ({
        ...color,
        color_id: color.color_id || null,
      }));
      await Color.bulkCreate(cleanedColors, {
        updateOnDuplicate: ['color_name', 'color_code', 'dual_color_code'],
      });
    }

    return variant;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const toggleStatus = async (uuid) => {
  const variant = await Variant.findOne({ where: { uuid } });
  variant.status = !variant.status;
  return variant.save();
};

const deleteVariant = async (uuid) => {
  const variant = await Variant.findOne({ where: { uuid } });
  await deleteObjects(
    `brand/${variant.brand_id}/${variant.model_id}`,
    variant.variant_id
  );
  return Variant.destroy({ where: { uuid } });
};

const getVariants = async () => {
  return Variant.findAll();
};

const getVariantIdByName = async (name) => {
  const variant = await Variant.findOne({
    raw: true,
    where: { variant_name: { [Op.like]: `${name.trim()}` } },
  });
  return variant?.variant_id;
};

const bulkCreateVariants = async (rows, user) => {
  const variants = [];
  const variantColors = [];

  for (const row of rows) {
    const brandId = await brandService.getBrandIdByName(row.brand_name);
    const modelId = await carModelService.getCarModelIdByName(row.model_name);
    const variantId = await getVariantIdByModelIdAndName(
      row.variant_name,
      modelId
    );

    variants.push({
      variant_name: row.variant_name,
      variant_type: row.variant_type,
      model_id: modelId,
      brand_id: brandId,
      seating_capacity: row.seating_capacity,
      status: row.status === 'on',
      created_by: user.id,
      updated_by: user.id,
    });

    variantColors.push({
      variant_id: variantId,
      color_name: row.color_name,
      color_code: row.color_code,
      dual_color_code: row.dual_color_code,
      created_by: user.id,
      updated_by: user.id,
    });
  }

  const variantData = await Variant.bulkCreate(variants);
  await Color.bulkCreate(variantColors);
  return variantData;
};

const bulkCreateariantColor = async (rows, user) => {
  const colors = [];
  for (const row of rows) {
    const brandId = await brandService.getBrandIdByName(row.brand_name);
    const modelId = await carModelService.getCarModelIdByName(row.model_name);
    const variantId = await getVariantIdByModelIdAndName(
      row.variant_name,
      modelId
    );

    colors.push({
      variant_id: variantId,
      color_name: row.color_name,
      color_code: row.color_code,
      dual_color_code: row.dual_color_code,
      created_by: user.id,
      updated_by: user.id,
    });
  }

  await Color.bulkCreate(colors);
};

module.exports = {
  getModelsByBrand,
  getVariantsByModel,
  getVariantIdByModelIdAndName,
  createVariant,
  getVariantByUuid,
  updateVariant,
  queryVariants,
  toggleStatus,
  deleteVariant,
  getVariants,
  getVariantIdByName,
  bulkCreateVariants,
  bulkCreateariantColor,
};
