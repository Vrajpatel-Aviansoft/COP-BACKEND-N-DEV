const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  brandService,
  carModelService,
  carGraphicsTypeService,
  carGraphicsService,
} = require("../services");
const {
  carGraphicsImagesValidationRules,
  carGraphicsVideosValidationRules,
} = require("../validations/imports/rules/car-graphics-rules");
const {
  carGraphicsImageCols,
} = require("../validations/imports/columns/car-graphics-cols");
const { readXlsxFromBuffer } = require("../utils/xlsxReader");
const { validateData } = require("../validations/imports/data-validator");

// <-------------------------------- import module ----------------------------------------->

const carGraphicsImageImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/car-graphics/import/image/create", {
      title: "Car Graphics (Images) Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const carGraphicsVideoImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/car-graphics/import/video/create", {
      title: "Car Graphics (Videos) Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const carGraphicsImageImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(
      rows,
      carGraphicsImagesValidationRules
    );
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const carGraphics = await carGraphicsService.bulkCreateCarGraphicsImage(
      req.user,
      rows
    );
    return res.json({
      success: true,
      data: carGraphics,
    });
  } catch (error) {
    next(error);
  }
});

const carGraphicsVideosImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(
      rows,
      carGraphicsVideosValidationRules
    );
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const carGraphics = await carGraphicsService.bulkCreateCarGraphicsVideo(
      req.user,
      rows
    );
    return res.json({
      success: true,
      data: carGraphics,
    });
  } catch (error) {
    next(error);
  }
});

// <-------------------------------- import module ----------------------------------------->

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

const carGraphicsView = catchAsync(async (req, res) => {
  try {
    const brands = await brandService.queryBrands();
    const carGraphicTypes = await carGraphicsTypeService.getCarGraphicTypes();
    return res.render("pages/car-graphics/view", {
      title: "Car Graphics View",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
      brands: brands.data,
      carGraphicTypes,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Render the variant creation view
 */
const carGraphicsCreateView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  const carGraphicTypes = await carGraphicsTypeService.getCarGraphicTypes();
  return res.render("pages/car-graphics/create", {
    title: "Create Car Graphics",
    layout: "./layouts/main",
    brands: brands.data,
    carGraphicTypes,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new variant
 */
const createCarGraphics = catchAsync(async (req, res, next) => {
  try {
    const carGraphicsData = await carGraphicsService.createCarGraphics(
      req.body,
      req.files,
      req.user
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Car Graphics created successfully",
      data: carGraphicsData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Query variants
 */
const getCarGraphics = catchAsync(async (req, res) => {
  const carGraphics = await carGraphicsService.queryCarGraphics(req.query);
  return res.status(httpStatus.OK).send(carGraphics);
});

/**
 * Render the variant edit view
 */
const editCarGraphicsView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  const carGraphicTypes = await carGraphicsTypeService.getCarGraphicTypes();
  const carGraphics = (
    await carGraphicsService.getCarGraphicsByUuid(req.params.uuid)
  ).get({
    plain: true,
  });
  const models = await carModelService.getCarModelsByBrandId(
    carGraphics.brand_id
  );
  return res.render("pages/car-graphics/edit", {
    title: "Edit Car Graphics",
    layout: "./layouts/main",
    brands: brands.data,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
    carGraphicTypes,
    carGraphics,
    models,
  });
});

const updateCarGraphics = catchAsync(async (req, res) => {
  const carGraphics = await carGraphicsService.updateCarGraphics(
    req.params.uuid,
    req.body,
    req.files,
    req.user
  );
  return res.status(httpStatus.OK).send(carGraphics);
});

const toggleStatus = catchAsync(async (req, res) => {
  await carGraphicsService.toggleStatus(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

const deleteCarGraphics = catchAsync(async (req, res) => {
  await carGraphicsService.deleteCarGraphics(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  getModelsByBrand,
  createCarGraphics,
  carGraphicsCreateView,
  carGraphicsView,
  getCarGraphics,
  editCarGraphicsView,
  updateCarGraphics,
  deleteCarGraphics,
  toggleStatus,
  carGraphicsImageImportView,
  carGraphicsImageImport,
  carGraphicsVideosImport,
  carGraphicsVideoImportView,
};
