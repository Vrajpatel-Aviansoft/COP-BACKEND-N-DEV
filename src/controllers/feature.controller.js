const httpStatus = require("http-status");
const {
  featureService,
  specificationService,
  featureOptionService,
  stanadardUnitService,
} = require("../services");
const catchAsync = require("../utils/catchAsync");
const { Specification } = require("../db/models");

const faetureView = (req, res, next) => {
  return res.render("pages/feature/view", {
    title: "Feature",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const featureCreateView = async (req, res, next) => {
  const specifications = await specificationService.getSpecifications();
  const featureOptions = await featureOptionService.getFeatureOptions();
  const standardUnits = await stanadardUnitService.getStandardUnits();
  return res.render("pages/feature/create", {
    title: "Feature",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    specifications,
    featureOptions,
    standardUnits,
  });
};

const editFeatureView = catchAsync(async (req, res, next) => {
  const specifications = await specificationService.getSpecifications();
  const featureOptions = await featureOptionService.getFeatureOptions();
  const standardUnits = await stanadardUnitService.getStandardUnits();
  const feature = await featureService.getFeatureByUuid(req.params.uuid);
  return res.render("pages/feature/edit", {
    title: "Feature",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    feature: feature.dataValues,
    specifications,
    featureOptions,
    standardUnits,
  });
});

const createFeature = async (req, res, next) => {
  const feature = await featureService.createFeature(
    req.user,
    req.body,
    req.files
  );
  return res.status(httpStatus.CREATED).send(feature);
};

const getFeatures = catchAsync(async (req, res, next) => {
  try {
    const features = await featureService.queryFeatures(req.query);
    res.status(httpStatus.OK).send(features);
  } catch (error) {
    console.error("Error in getFeatures:", error);
    next(error);
  }
});

const toggleFeatureStatus = catchAsync(async (req, res, next) => {
  const feature = await featureService.toggleFeatureStatus(req.params.uuid);
  return res.status(httpStatus.OK).send(feature);
});

const updateFeature = catchAsync(async (req, res, next) => {
  const feature = await featureService.updateFeature(
    req.params.uuid,
    req.body,
    req.files
  );
  return res.status(httpStatus.OK).send(feature);
});

const deleteFeature = catchAsync(async (req, res, next) => {
  await featureService.deleteFeature(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  faetureView,
  featureCreateView,
  createFeature,
  getFeatures,
  toggleFeatureStatus,
  deleteFeature,
  editFeatureView,
  updateFeature,
};
