const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  brandService,
  carModelService,
  bannerService,
  variantService,
  warningLightService,
} = require("../services");

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
      message: "No models found for the selected brand",
    });
  }
});

const warningLightView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/warning-light/view", {
      title: "Warning light View",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Render the warning light create view
 */
const warningLightCreateView = catchAsync(async (req, res) => {
  return res.render("pages/warning-light/create", {
    title: "Create Warning light",
    layout: "./layouts/main",
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new warning light
 */
const createWarningLight = catchAsync(async (req, res, next) => {
  try {
    const warningLightData = await warningLightService.createWarningLight(
      req.body,
      req.files,
      req.user
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Warning light created successfully",
      data: warningLightData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Query warning lights
 */
const getWarningLights = catchAsync(async (req, res) => {
  const warningLights = await warningLightService.queryWarningLights(req.query);
  return res.status(httpStatus.OK).send(warningLights);
});

/**
 * Render the warning light edit view
 */
const editWarningLightView = catchAsync(async (req, res) => {
  const warningLight = await warningLightService.getWarningLightByUuid(
    req.params.uuid,
    { raw: true }
  );
  return res.render("pages/warning-light/edit", {
    title: "Edit Warning light",
    layout: "./layouts/main",
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
    warningLight,
  });
});

const updateWarningLight = catchAsync(async (req, res) => {
  const warningLight = await warningLightService.updateWarningLight(
    req.params.uuid,
    req.body,
    req.files,
    req.user
  );
  return res.status(httpStatus.OK).send(warningLight);
});

const toggleStatus = catchAsync(async (req, res) => {
  await warningLightService.toggleStatus(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

const deleteWarningLight = catchAsync(async (req, res) => {
  await warningLightService.deleteWarningLight(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  getModelsByBrand,
  createWarningLight,
  warningLightCreateView,
  warningLightView,
  getWarningLights,
  editWarningLightView,
  updateWarningLight,
  deleteWarningLight,
  toggleStatus,
};
