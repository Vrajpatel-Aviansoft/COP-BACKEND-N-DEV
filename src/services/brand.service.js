const { Brand } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const { uploadFiles, getImageBuffer } = require('../utils/fileUpload');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { brandColumns } = require('../validations/imports/columns/brand-cols');

const getBrandIdByName = async (name) => {
  const brand = await Brand.findOne({
    where: { brand_name: { [Op.like]: name?.trim() } },
    raw: true,
    attributes: ['brand_id'],
  });
  return brand?.brand_id;
};

const isBrandTaken = async (name) => {
  return (await Brand.count({ where: { brand_name: name } })) > 0;
};

const getBrandByUuid = async (uuid) => {
  return Brand.findOne({ where: { uuid } });
};

const createBrand = async (user, brandBody, brandFiles) => {
  if (await isBrandTaken(brandBody.brand_name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Brand already exists');
  }
  const brand = await Brand.create({
    ...brandBody,
    created_by: user.id,
    updated_by: user.id,
  });
  const brandFileConfig = [
    {
      buffer: brandFiles.brand_logo[0].buffer,
      filename: `/brand/${brand.brand_id}/${brand.brand_id}.webp`,
      contentType: 'image/webp',
    },
    {
      buffer: brandFiles.brand_banner[0].buffer,
      filename: `/brand/${brand.brand_id}/${brand.brand_id}_banner.webp`,
      contentType: 'image/webp',
    },
  ];
  await uploadFiles(brandFileConfig);
  await brand
    .set({
      brand_logo: `${brand.brand_id}.webp`,
      brand_banner: `${brand.brand_id}_banner.webp`,
    })
    .save();
};

const bulkCreateBrands = async (user, rows) => {
  const brandNames = rows.map((row) => row[brandColumns.BRAND_NAME]);
  const existingBrands = await Brand.findAll({
    raw: true,
    where: {
      brand_name: { [Op.in]: brandNames },
    },
    attributes: ['uuid', 'brand_name'],
  });

  const existingBrandMap = new Map(
    existingBrands.map((brand) => [brand.brand_name.toLowerCase(), brand])
  );

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const brandLogoBuffer = await getImageBuffer(row[brandColumns.BRAND_LOGO], {
      index: i + 1,
      field: 'Brand Logo',
    });
    const brandBannerBuffer = await getImageBuffer(
      row[brandColumns.BRAND_BANNER],
      {
        index: i + 1,
        field: 'Brand Banner',
      }
    );

    const brandFiles = {
      brand_logo: [{ buffer: brandLogoBuffer }],
      brand_banner: [{ buffer: brandBannerBuffer }],
    };

    const brandBody = {
      brand_name: row[brandColumns.BRAND_NAME],
      brand_description: row[brandColumns.BRAND_DESCRIPTION],
    };

    const existingBrand = existingBrandMap.get(
      row[brandColumns.BRAND_NAME].toLowerCase()
    );

    if (existingBrand) {
      await updateBrand(existingBrand.uuid, brandBody, brandFiles);
    } else {
      await createBrand(user, brandBody, brandFiles);
    }
  }
};

const queryBrands = async (query) => {
  const queryOptions = buildQueryOptions(query);
  const brands = await Brand.findAndCountAll(queryOptions);
  return formatQueryResult(brands, query);
};

const deleteBrand = async (uuid) => {
  return Brand.destroy({ where: { uuid } });
};

const getBrandById = async (id) => {
  return Brand.findByPk(id);
};

const getBrandByName = async (name) => {
  return Brand.findOne({ where: { [Op.like]: name } });
};

const editBrand = async (uuid, brandBody) => {
  return Brand.update(brandBody, {
    where: { uuid },
  });
};

const toggleBrandStatus = async (uuid) => {
  const brand = await Brand.findOne({ where: { uuid } });
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  brand.status = !brand.status;
  return brand.save();
};

const updateBrand = async (uuid, brandBody, brandFiles) => {
  const brand = await Brand.findOne({ where: { uuid } });
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  if (brandFiles.brand_logo) {
    await uploadFiles([
      {
        buffer: brandFiles.brand_logo[0].buffer,
        filename: `/brand/${brand.brand_id}/${brand.brand_id}.webp`,
        contentType: 'image/webp',
      },
    ]);
  }
  if (brandFiles.brand_banner) {
    await uploadFiles([
      {
        buffer: brandFiles.brand_banner[0].buffer,
        filename: `/brand/${brand.brand_id}/${brand.brand_id}_banner.webp`,
        contentType: 'image/webp',
      },
    ]);
  }
  return brand
    .set({
      ...brandBody,
      brand_logo: `${brand.brand_id}.webp`,
      brand_banner: `${brand.brand_id}_banner.webp`,
    })
    .save();
};

const getIdFromUuid = async (uuid) => {
  return Brand.findOne({ where: { uuid } });
};

const getBrands = async () => {
  return Brand.findAll();
};

module.exports = {
  createBrand,
  isBrandTaken,
  queryBrands,
  deleteBrand,
  getBrandById,
  editBrand,
  toggleBrandStatus,
  getBrandByUuid,
  updateBrand,
  getIdFromUuid,
  getBrands,
  bulkCreateBrands,
  getBrandIdByName,
  getBrandByName,
};
