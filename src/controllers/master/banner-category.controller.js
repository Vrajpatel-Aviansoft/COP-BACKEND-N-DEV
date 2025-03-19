const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { bannerCategoryService } = require("../../services");
/**
 * Render the Car Stage View
 */
const bannerCategoryview = catchAsync(async (req, res) => {
  return res.render("pages/banner-category/view", {
    title: "Banner Catrgory",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new Car Stage
 */


const bannerCategoryCreateView = catchAsync(async (req, res) => {
  return res.render("pages/banner-category/create", {
    title: "Banner Catrgory",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});


const createBannerCategory = catchAsync(async (req, res) => {
  const bannerCategory = await bannerCategoryService.createBannerCategory(
    req.body
  );
  res.status(httpStatus.CREATED).send(bannerCategory);
});

/**
 * Get Car Stages for DataTable
 */

const getBannerCategories = catchAsync(async (req, res, next) => {
  try {
    const bannerCategories = await bannerCategoryService.queryBannerCategories(
      req.query
    );
    res.status(httpStatus.OK).send(bannerCategories);
  } catch (error) {
    console.error("Error in getBannerCategories:", error);
    next(error);
  }
});


/**
 * Delete a Car Stage
 */
const deleteBannerCategory = catchAsync(async (req, res) => {
  await bannerCategoryService.deleteBannerCategory(req.params.id);
  res.sendStatus(httpStatus.OK);
});

/**
 * Render the Edit Car Stage View
 */
const editBannerCategoryView = catchAsync(async (req, res) => {
  const bannerCategory = await bannerCategoryService.getBannerCategoryByUuid(
    req.params.uuid
  );
  res.render("pages/banner-category/edit", {
    bannerCategory,
    title: "Banner Category Edit",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

/**
 * Update a Car Stage
 */
const editBannerCategory = catchAsync(async (req, res) => {
  const bannerCategory = await bannerCategoryService.editBannerCategory(
    req.params.uuid,
    req.body
  );
  res.status(httpStatus.OK).send(bannerCategory);
});

module.exports = {
  bannerCategoryview,
  bannerCategoryCreateView,
  createBannerCategory,
  getBannerCategories,
  deleteBannerCategory,
  editBannerCategoryView,
  editBannerCategory,
};
