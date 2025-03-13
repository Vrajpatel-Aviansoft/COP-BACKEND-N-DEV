const { BannerCategory } = require('../../db/models');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');

const isBannerCategoryTaken = async (name) => {
  const count = await BannerCategory.count({ where: { bc_name: name } });
  return count > 0;
};

const createBannerCategory = async (bannerCategoryBody) => {
  if (await isBannerCategoryTaken(bannerCategoryBody.bc_name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Banner category already taken');
  }
  return BannerCategory.create(bannerCategoryBody);
};

const queryBannerCategories = async (query) => {
  const draw = parseInt(query.draw) || 1;
  const start = parseInt(query.start) || 0;
  const length = parseInt(query.length) || 10;
  const searchValue = query.search?.value || '';

  const where = searchValue
    ? { bc_name: { [Op.like]: `%${searchValue}%` } }
    : {};

  const { count, rows } = await BannerCategory.findAndCountAll({
    where,
    limit: length,
    offset: start,
  });

  return {
    draw,
    recordsTotal: count,
    recordsFiltered: count,
    data: rows.map((row) => ({
      bc_name: row.bc_name,
      uuid: row.uuid,
    })),
  };
};

const deleteBannerCategory = async (uuid) => {
  return BannerCategory.destroy({ where: { uuid } });
};

const getBannerCategoryByUuid = async (uuid) => {
  return BannerCategory.findOne({ where: { uuid } });
};

const editBannerCategory = async (uuid, bannerCategoryBody) => {
  return BannerCategory.update(bannerCategoryBody, {
    where: { uuid },
  });
};

module.exports = {
  createBannerCategory,
  isBannerCategoryTaken,
  queryBannerCategories,
  deleteBannerCategory,
  getBannerCategoryByUuid,
  editBannerCategory,
};
