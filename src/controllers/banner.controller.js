const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  brandService,
  carModelService,
  bannerService,
  variantService,
} = require('../services');

/**
 * Get models by brand ID
 */
const getModelsByBrand = catchAsync(async (req, res) => {
  const { brandId } = req.params;
  const models = await carModelService.getCarModelsByBrandId(brandId);

  if (models.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, models });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'No models found for the selected brand',
    });
  }
});

const bannerView = catchAsync(async (req, res) => {
  try {
    return res.render('pages/banner/view', {
      title: 'Banner View',
      layout: './layouts/main',
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Render the variant creation view
 */
const bannerCreateView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  const bannerCategories = await bannerService.queryBannerCategories();
  return res.render('pages/banner/create', {
    title: 'Create Banner',
    layout: './layouts/main',
    brands: brands.data,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
    bannerCategories,
  });
});

/**
 * Create a new variant
 */
const createBanner = catchAsync(async (req, res, next) => {
  try {
    const bannerData = await bannerService.createBanner(
      req.body,
      req.files,
      req.user
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Banner created successfully',
      data: bannerData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Query banners
 */
const getBanners = catchAsync(async (req, res) => {
  const banners = await bannerService.queryBanners(req.query);
  return res.status(httpStatus.OK).send(banners);
});

/**
 * Render the variant edit view
 */
const editBannerView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  const banner = (await bannerService.getBannerByUuid(req.params.uuid)).get({
    plain: true,
  });

  const models = await carModelService.getCarModelsByBrandId(banner.brand_id);
  const variants = await variantService.getVariantsByModel(banner.model_id);
  const bannerCategories = await bannerService.queryBannerCategories();
  return res.render('pages/banner/edit', {
    title: 'Edit Banner',
    layout: './layouts/main',
    brands: brands.data,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
    banner,
    models,
    variants,
    bannerCategories,
  });
});

const updateBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.updateBanner(
    req.params.uuid,
    req.body,
    req.files,
    req.user
  );
  return res.status(httpStatus.OK).send(banner);
});

const toggleStatus = catchAsync(async (req, res) => {
  await bannerService.toggleStatus(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

const deleteBanner = catchAsync(async (req, res) => {
  await bannerService.deleteBanner(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  getModelsByBrand,
  createBanner,
  bannerCreateView,
  bannerView,
  getBanners,
  editBannerView,
  updateBanner,
  deleteBanner,
  toggleStatus,
};
