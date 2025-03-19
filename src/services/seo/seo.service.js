const {
  Brand,
  CarModel,
  Variant,
  SeoMetaTag,
  SeoPage,
  Seo,
} = require('../../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../../utils/queryHelper');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');

const querySeoData = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);

    queryOptions.include = [
      {
        model: Brand,
        as: 'brand',
        attributes: ['brand_name'],
      },
      {
        model: CarModel,
        as: 'carModel',
        attributes: ['model_name'],
      },
      {
        model: Variant,
        as: 'variant',
        attributes: ['variant_name'],
      },
      {
        model: SeoMetaTag,
        as: 'seoMetaTag',
        attributes: ['meta_tag_name'],
      },
      {
        model: SeoPage,
        as: 'seoPage',
        attributes: ['page_name'],
      },
    ];

    const whereConditions = {};

    if (query.tab === 'brand') {
      whereConditions['brand_id'] = { [Op.ne]: null };
      whereConditions['model_id'] = null;
      whereConditions['variant_id'] = null;
    } else if (query.tab === 'model') {
      whereConditions['brand_id'] = { [Op.ne]: null };
      whereConditions['model_id'] = { [Op.ne]: null };
      whereConditions['variant_id'] = null;
    } else if (query.tab === 'variant') {
      whereConditions['brand_id'] = { [Op.ne]: null };
      whereConditions['model_id'] = { [Op.ne]: null };
      whereConditions['variant_id'] = { [Op.ne]: null };
    } else if (query.tab === 'page') {
      whereConditions['brand_id'] = null;
      whereConditions['model_id'] = null;
      whereConditions['variant_id'] = null;
    }

    queryOptions.where = whereConditions;
    const seo = await Seo.findAndCountAll(queryOptions);

    return formatQueryResult(seo, query);
  } catch (error) {
    console.error('Error in querySeo:', error);
    throw error;
  }
};

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

const getSeoDataByUuid = async (uuid) => {
  try {
    return Seo.findAll({
      where: { uuid: uuid },
      include: [
        {
          model: Brand,
          as: 'brand',
        },
        {
          model: CarModel,
          as: 'carModel',
        },
        {
          model: Variant,
          as: 'variant',
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

const createSeo = async (user, seoBody) => {
  const {
    seo_id,
    uuid,
    brand_id,
    model_id,
    variant_id,
    meta_tag_id,
    page_id,
    tag_content,
    seo_type,
  } = seoBody;

  try {
    if (uuid && seo_id) {
      let existingSEO = await Seo.findOne({
        where: {
          uuid: uuid,
          seo_id: seo_id,
        },
      });

      if (existingSEO) {
        existingSEO.seo_type = seo_type;
        existingSEO.brand_id = brand_id || null;
        existingSEO.model_id = model_id || null;
        existingSEO.variant_id = variant_id || null;
        existingSEO.meta_tag_id = meta_tag_id;
        existingSEO.page_id = page_id;
        existingSEO.tag_content = tag_content;

        await existingSEO.save();
        return existingSEO;
      }
    }
    const newSEO = await Seo.create({
      seo_type: seo_type,
      brand_id: brand_id || null,
      model_id: model_id || null,
      variant_id: variant_id || null,
      meta_tag_id: meta_tag_id,
      page_id: page_id,
      tag_content: tag_content,
    });

    return newSEO;
  } catch (error) {
    throw new Error(
      'Error occurred while creating/updating SEO data: ' + error.message
    );
  }
};

const deleteSeo = async (uuid) => {
  return Seo.destroy({ where: { uuid } });
};

module.exports = {
  querySeoData,
  getModelsByBrand,
  getVariantsByModel,
  getSeoDataByUuid,
  createSeo,
  deleteSeo,
};
