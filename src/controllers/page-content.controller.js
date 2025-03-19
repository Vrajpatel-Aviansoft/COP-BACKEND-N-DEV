const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { pageContentService } = require("../services");

const pageContentView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/page-content/view", {
      title: "Page Content View",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Render the page content creation view
 */
const pageContentCreateView = catchAsync(async (req, res) => {
  return res.render("pages/page-content/create", {
    title: "Create Page Content",
    layout: "./layouts/main",
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new page content
 */
const createPageContent = catchAsync(async (req, res, next) => {
  try {
    const pageContentData = await pageContentService.createPageContent(
      req.body,
      req.user
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Page content created successfully",
      data: pageContentData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Query page contents
 */
const getPageContents = catchAsync(async (req, res) => {
  const pageContents = await pageContentService.queryPageContents(req.query);
  return res.status(httpStatus.OK).send(pageContents);
});

/**
 * Render the page content edit view
 */
const editPageContentView = catchAsync(async (req, res) => {
  const pageContent = await pageContentService.getPageContentByUuid(
    req.params.uuid
  );
  return res.render("pages/page-content/edit", {
    title: "Edit Page Content",
    layout: "./layouts/main",
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
    pageContent,
  });
});

const updatePageContent = catchAsync(async (req, res) => {
  const pageContent = await pageContentService.updatePageContent(
    req.params.uuid,
    req.body,
    req.files,
    req.user
  );
  return res.status(httpStatus.OK).send(pageContent);
});

const toggleStatus = catchAsync(async (req, res) => {
  await pageContentService.toggleStatus(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

const deletePageContent = catchAsync(async (req, res) => {
  await pageContentService.deletePageContent(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  createPageContent,
  pageContentCreateView,
  pageContentView,
  getPageContents,
  editPageContentView,
  updatePageContent,
  deletePageContent,
  toggleStatus,
};
