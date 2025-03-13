const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { PageContent } = require('../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../utils/queryHelper');

const queryPageContents = async (query) => {
  const queryOptions = buildQueryOptions(query);
  const pageContents = await PageContent.findAndCountAll(queryOptions);
  return formatQueryResult(pageContents, query);
};

const createPageContent = async (body, user) => {
  try {
    const pageContent = await PageContent.create({
      ...body,
      status: body.status === 'on',
      created_by: user.id,
    });
    return pageContent;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const getPageContentByUuid = async (uuid) => {
  return PageContent.findOne({
    where: { uuid },
    raw: true,
  });
};

const updatePageContent = async (uuid, body, user) => {
  try {
    const pageContent = await PageContent.findOne({ where: { uuid } });
    if (!pageContent) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Page content not found');
    }
    return pageContent.update({
      ...body,
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
  const pageContent = await PageContent.findOne({ where: { uuid } });
  pageContent.status = !pageContent.status;
  return pageContent.save();
};

const deletePageContent = async (uuid) => {
  return PageContent.destroy({ where: { uuid } });
};

module.exports = {
  createPageContent,
  queryPageContents,
  getPageContentByUuid,
  updatePageContent,
  deletePageContent,
  toggleStatus,
};
