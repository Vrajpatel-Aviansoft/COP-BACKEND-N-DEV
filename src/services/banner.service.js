const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const {
  Banner,
  BannerCategory,
  Brand,
  CarModel,
  Variant,
} = require('../db/models');
const { uploadFiles } = require('../utils/fileUpload');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');
const { deleteObjects } = require('../config/minio');

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

const queryBannerCategories = async () => {
  return BannerCategory.findAll({
    raw: true,
    attributes: ['bc_id', 'bc_name'],
  });
};

const createBanner = async (body, files, user) => {
  try {
    const desktopImages = files.filter(
      (file) => file.fieldname === 'banner_image'
    );
    const mobileImages = files.filter(
      (file) => file.fieldname === 'banner_image_mob'
    );

    const banner = await Banner.create({
      ...body,
      status: body.status === 'on',
      created_by: user.id,
    });

    const path = `/banner`;
    const contentType = 'image/webp';

    if (desktopImages.length > 0) {
      banner.banner_image = `${banner.banner_id}.webp`;
      await uploadFiles([
        {
          buffer: desktopImages[0].buffer,
          filename: `${path}/${banner.banner_image}`,
          contentType,
        },
      ]);
    }

    if (mobileImages.length > 0) {
      banner.banner_image_mob = `${banner.banner_id}_mob.webp`;
      await uploadFiles([
        {
          buffer: mobileImages[0].buffer,
          filename: `${path}/${banner.banner_image_mob}`,
          contentType,
        },
      ]);
    }

    await banner.save();
    return banner;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryBanners = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    queryOptions.include = [
      {
        model: BannerCategory,
        attributes: ['bc_name'],
        as: 'banner_category',
        raw: true,
      },
      {
        model: Brand,
        attributes: ['brand_name'],
        as: 'brand',
        raw: true,
      },
      {
        model: CarModel,
        attributes: ['model_name'],
        as: 'model',
        raw: true,
      },
      {
        model: Variant,
        attributes: ['variant_name'],
        as: 'variant',
        raw: true,
      },
    ];
    const banners = await Banner.findAndCountAll(queryOptions);
    return formatQueryResult(banners, query);
  } catch (error) {
    console.error('Error in queryBanners:', error);
    throw error;
  }
};

const getBannerByUuid = async (uuid) => {
  return Banner.findOne({
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
    ],
  });
};

const updateBanner = async (uuid, body, files, user) => {
  try {
    const banner = await Banner.findOne({ where: { uuid } });

    if (!banner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Car graphics not found');
    }

    const desktopImages = files.filter(
      (file) => file.fieldname === 'banner_image'
    );
    const mobileImages = files.filter(
      (file) => file.fieldname === 'banner_image_mob'
    );

    const path = `/banner`;
    const contentType = 'image/webp';

    if (desktopImages.length > 0) {
      await uploadFiles([
        {
          buffer: desktopImages[0].buffer,
          filename: `${path}/${banner.banner_image}`,
          contentType,
        },
      ]);
    }

    if (mobileImages.length > 0) {
      if (!banner.banner_image_mob) {
        banner.banner_image_mob = `${banner.banner_id}_mob.webp`;
        await banner.save();
      }
      await uploadFiles([
        {
          buffer: mobileImages[0].buffer,
          filename: `${path}/${banner.banner_image_mob}`,
          contentType,
        },
      ]);
    }
    return banner.update({
      ...body,
      model_id: body.model_id || null,
      brand_id: body.brand_id || null,
      variant_id: body.variant_id || null,
      updated_by: user.id,
      status: body.status === 'on',
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const toggleStatus = async (uuid) => {
  const carGraphics = await CarGraphics.findOne({ where: { uuid } });
  carGraphics.status = !carGraphics.status;
  return carGraphics.save();
};

const deleteBanner = async (uuid) => {
  const banner = await Banner.findOne({ where: { uuid } });
  await deleteObjects(`banner`, `${banner.banner_id}`);
  return Banner.destroy({ where: { uuid } });
};

module.exports = {
  getModelsByBrand,
  createBanner,
  queryBanners,
  getBannerByUuid,
  updateBanner,
  deleteBanner,
  toggleStatus,
  queryBannerCategories,
};
