const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  brandService,
  carModelService,
  variantService,
} = require("../services");

const {
  variantValidationRules,
  variantColorValidationRules,
} = require("../validations/imports/rules/variant-rules");
const { validateData } = require("../validations/imports/data-validator");
const { readXlsxFromBuffer } = require("../utils/xlsxReader");
const {
  variantColumns,
  variantColorColumns,
} = require("../validations/imports/columns/variant-cols");

// <-------------------------------- import module ----------------------------------------->

const variantImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/variant/import/create", {
      title: "Variant Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const variantColorImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/variant/import/color/create", {
      title: "Variant Color Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const variantImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(
      rows,
      variantValidationRules,
      variantColumns.VARIANT_NAME
    );
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const variants = await variantService.bulkCreateVariants(req.user, rows);

    return res.json({
      success: true,
      data: variants,
    });
  } catch (error) {
    next(error);
  }
});

const variantColorImport = catchAsync(async (req, res, next) => {
  try {
    req.setTimeout(600000);
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(
      rows,
      variantColorValidationRules,
      // variantColorColumns.COLOR_NAME
    );
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const variantColors = await variantService.bulkCreateariantColor(
      req.user,
      rows
    );

    return res.json({
      success: true,
      data: variantColors,
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
  const models = await variantService.getModelsByBrand(brandId);

  if (models.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, models });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No models found for the selected brand",
    });
  }
});

/**
 * Get variants by model ID
 */
const getVariantsByModel = catchAsync(async (req, res) => {
  const { modelId } = req.params;
  const variants = await variantService.getVariantsByModel(modelId);
  return res.status(httpStatus.OK).json({ success: true, variants });
});

const variantView = catchAsync(async (req, res) => {
  return res.render("pages/variant/view", {
    title: "Variant View",
    layout: "./layouts/main",
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
  });
});

/**
 * Render the variant creation view
 */
const variantCreateView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  return res.render("pages/variant/create", {
    title: "Create Variant",
    layout: "./layouts/main",
    brands: brands.data,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new variant
 */
const createVariant = catchAsync(async (req, res, next) => {
  try {
    const variantData = await variantService.createVariant(
      req.body,
      req.files,
      req.user
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Variant created successfully",
      data: variantData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Query variants
 */
const getVariants = catchAsync(async (req, res) => {
  const variants = await variantService.queryVariants(req.query);
  return res.status(httpStatus.OK).send(variants);
});

/**
 * Render the variant edit view
 */
const editVariantView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  const variant = (await variantService.getVariantByUuid(req.params.uuid)).get({
    plain: true,
  });
  const models = await carModelService.getCarModelsByBrandId(variant.brand_id);
  return res.render("pages/variant/edit", {
    title: "Edit Variant",
    layout: "./layouts/main",
    brands: brands.data,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
    variant,
    models,
  });
});

const updateVariant = catchAsync(async (req, res) => {
  const variant = await variantService.updateVariant(
    req.params.uuid,
    req.body,
    req.files,
    req.user
  );
  return res.status(httpStatus.OK).send(variant);
});

const toggleStatus = catchAsync(async (req, res) => {
  await variantService.toggleStatus(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

const deleteVariant = catchAsync(async (req, res) => {
  await variantService.deleteVariant(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  getModelsByBrand,
  createVariant,
  variantCreateView,
  variantView,
  getVariants,
  editVariantView,
  updateVariant,
  deleteVariant,
  toggleStatus,
  getVariantsByModel,
  variantImportView,
  variantImport,
  variantColorImportView,
  variantColorImport,
};
