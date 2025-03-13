const httpStatus = require("http-status");
const { pageService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

const PageView = (req, res, next) => {
  return res.render("pages/seo/pages/view", {
    title: "Pages",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const PageCreateView = async (req, res, next) => {
  return res.render("pages/seo/pages/create", {
    title: "Pages",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const editPageView = catchAsync(async (req, res, next) => {
  const page = await pageService.getPageByUuid(req.params.uuid);
  return res.render("pages/seo/pages/edit", {
    title: "Pages",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    page: page.dataValues,
  });
});

const createPage = async (req, res, next) => {
  const page = await pageService.createPages(req.user, req.body);
  return res.status(httpStatus.CREATED).send(page);
};

const getPage = catchAsync(async (req, res, next) => {
  try {
    const pages = await pageService.queryPages(req.query);
    res.status(httpStatus.OK).send(pages);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

const togglePageStatus = catchAsync(async (req, res, next) => {
  const pages = await pageService.togglePageStatus(req.params.uuid);
  return res.status(httpStatus.OK).send(pages);
});

const updatePage = catchAsync(async (req, res, next) => {
  const pages = await pageService.updatePage(
    req.params.uuid,
    req.body,
    req.files
  );
  return res.status(httpStatus.OK).send(pages);
});

const deletePage = catchAsync(async (req, res, next) => {
  await pageService.deletePages(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  PageView,
  PageCreateView,
  editPageView,
  createPage,
  getPage,
  togglePageStatus,
  updatePage,
  deletePage,
};
