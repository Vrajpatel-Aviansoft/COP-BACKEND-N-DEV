const { SeoPage } = require('../../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../../utils/queryHelper');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const isPageTaken = async (name) => {
  try {
    return (await SeoPage.count({ where: { page_name: name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createPages = async (user, PageBody) => {
  try {
    if (await isPageTaken(PageBody.page_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Page already exists');
    }
    const pages = await SeoPage.create({
      ...PageBody,
    });
    return pages;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryPages = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    const pages = await SeoPage.findAndCountAll(queryOptions);
    return formatQueryResult(pages, query);
  } catch (error) {
    console.error('Error in queryTags:', error);
    throw error;
  }
};

const deletePages = async (uuid) => {
  return SeoPage.destroy({ where: { uuid } });
};

const getPageByUuid = async (uuid) => {
  return SeoPage.findOne({ where: { uuid } });
};

const togglePageStatus = async (uuid) => {
  const pages = await SeoPage.findOne({ where: { uuid } });
  if (!pages) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
  }
  pages.status = !pages.status;
  return pages.save();
};

const updatePage = async (uuid, PageBody) => {
  const pages = await SeoPage.findOne({ where: { uuid } });
  if (!pages) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
  }

  return pages
    .set({
      ...PageBody,
    })
    .save();
};

module.exports = {
  createPages,
  queryPages,
  deletePages,
  getPageByUuid,
  togglePageStatus,
  updatePage,
};
