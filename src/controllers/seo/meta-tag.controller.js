const httpStatus = require("http-status");
const { metaTagService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

const TagView = (req, res, next) => {
  return res.render("pages/seo/meta-tag/view", {
    title: "Meta Tag",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const TagCreateView = async (req, res, next) => {
  return res.render("pages/seo/meta-tag/create", {
    title: "Meta Tag",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const editTagView = catchAsync(async (req, res, next) => {
  const metaTag = await metaTagService.getTagByUuid(req.params.uuid);
  return res.render("pages/seo/meta-tag/edit", {
    title: "Meta Tag",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    metaTag: metaTag.dataValues,
  });
});

const createTag = async (req, res, next) => {
  const spec = await metaTagService.createTags(req.user, req.body);
  return res.status(httpStatus.CREATED).send(spec);
};

const getTags = catchAsync(async (req, res, next) => {
  try {
    const specs = await metaTagService.queryTags(req.query);
    res.status(httpStatus.OK).send(specs);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

const toggleTagStatus = catchAsync(async (req, res, next) => {
  const specification = await metaTagService.toggleTagStatus(req.params.uuid);
  return res.status(httpStatus.OK).send(specification);
});

const updateTag = catchAsync(async (req, res, next) => {
  const specification = await metaTagService.updateTag(
    req.params.uuid,
    req.body,
    req.files
  );
  return res.status(httpStatus.OK).send(specification);
});

const deleteTag = catchAsync(async (req, res, next) => {
  await metaTagService.deleteMetaTags(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  TagView,
  TagCreateView,
  editTagView,
  createTag,
  getTags,
  toggleTagStatus,
  updateTag,
  deleteTag,
};
