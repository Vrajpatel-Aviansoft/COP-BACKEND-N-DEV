const { SeoMetaTag } = require('../../db/models');
const {
  buildQueryOptions,
  formatQueryResult,
} = require('../../utils/queryHelper');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const isTagTaken = async (name) => {
  try {
    return (await SeoMetaTag.count({ where: { meta_tag_name: name } })) > 0;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const createTags = async (user, TagBody) => {
  try {
    if (await isTagTaken(TagBody.meta_tag_name)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Meta Tag already exists');
    }
    const metaTags = await SeoMetaTag.create({
      ...TagBody,
    });
    return metaTags;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};

const queryTags = async (query) => {
  try {
    const queryOptions = buildQueryOptions(query);
    const tags = await SeoMetaTag.findAndCountAll(queryOptions);
    return formatQueryResult(tags, query);
  } catch (error) {
    console.error('Error in queryTags:', error);
    throw error;
  }
};

const deleteMetaTags = async (uuid) => {
  return SeoMetaTag.destroy({ where: { uuid } });
};

const getTagByUuid = async (uuid) => {
  return SeoMetaTag.findOne({ where: { uuid } });
};

const toggleTagStatus = async (uuid) => {
  const metaTags = await SeoMetaTag.findOne({ where: { uuid } });
  if (!metaTags) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meta Tag not found');
  }
  metaTags.status = !metaTags.status;
  return metaTags.save();
};

const updateTag = async (uuid, TagBody) => {
  const metaTags = await SeoMetaTag.findOne({ where: { uuid } });
  if (!metaTags) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meta Tag not found');
  }

  return metaTags
    .set({
      ...TagBody,
    })
    .save();
};

module.exports = {
  createTags,
  queryTags,
  deleteMetaTags,
  getTagByUuid,
  toggleTagStatus,
  updateTag,
};
