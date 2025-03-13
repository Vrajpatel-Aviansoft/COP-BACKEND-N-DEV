const httpStatus = require("http-status");
const {
  priceEntryService,
  brandService,
  featureValueService,
  specificationService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const { Specification } = require("../db/models");
const {
  featureValueValidationRules,
} = require("../validations/imports/rules/feature-value-rules");
const { readXlsxFromBuffer } = require("../utils/xlsxReader");
const { validateData } = require("../validations/imports/data-validator");

const getModelsByBrand = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const models = await featureValueService.getModelsByBrand(uuid);

  if (models.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, models });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No models found for the selected brand",
    });
  }
});

const getVariantsByModel = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const variants = await featureValueService.getVariantsByModel(uuid);

  if (variants.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, variants });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No variants found for the selected model",
    });
  }
});

const getFeaturesBySpecs = catchAsync(async (req, res) => {
  const specs = await specificationService.getSpecificationsByUuid(
    req.params.uuid,
    req.body.vuuid
  );

  if (specs.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, specs });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No Features found for the selected Specs",
    });
  }
});

const featureValueCreateView = async (req, res, next) => {
  const specifications = await specificationService.getSpecifications();
  const brands = await brandService.getBrands();

  return res.render("pages/feature-value/create", {
    title: "Feature Value",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    specifications,
    brands,
  });
};

const createFeatureValue = async (req, res, next) => {
  const featureValue = await featureValueService.createFeatureValue(
    req.user,
    req.body
  );
  return res.status(httpStatus.CREATED).send(featureValue);
};

// <--------------------------------feature Value import module Start----------------------------------------->

const featureValueImportView = catchAsync(async (req, res) => {
  return res.render("pages/feature-value/import/create", {
    title: "Feature Value Import",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
});

const featureValueImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(rows, featureValueValidationRules);
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const featureValue = await featureValueService.bulkCreateFeatureValue(
      req.user,
      rows
    );

    return res.json({
      success: true,
      data: featureValue,
    });
  } catch (error) {
    next(error);
  }
});

// <--------------------------------feature Value import module End----------------------------------------->

module.exports = {
  featureValueCreateView,
  getModelsByBrand,
  getVariantsByModel,
  getFeaturesBySpecs,
  createFeatureValue,
  featureValueImportView,
  featureValueImport,
};
