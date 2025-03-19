const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { carStageService } = require("../../services");
/**
 * Render the Car Stage View
 */
const carStageView = catchAsync(async (req, res) => {
  return res.render("pages/car-stage/view", {
    title: "Car Stage",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

const carStageCreateView = catchAsync(async (req, res) => {
  return res.render("pages/car-stage/create", {
    title: "Car Stage",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new Car Stage
 */
const createCarStage = catchAsync(async (req, res) => {
  const carStage = await carStageService.createCarStage(req.body);
  res.status(httpStatus.CREATED).send(carStage);
});

/**
 * Get Car Stages for DataTable
 */

const getCarStages = catchAsync(async (req, res, next) => {
  try {
    const carStages = await carStageService.queryCarStages(req.query);
    res.status(httpStatus.OK).send(carStages);
  } catch (error) {
    console.error("Error in getCarStages:", error);
    next(error);
  }
});

/**
 * Delete a Car Stage
 */
const deleteCarStage = catchAsync(async (req, res) => {
  await carStageService.deleteCarStage(req.params.uuid);
  res.sendStatus(httpStatus.OK);
});

/**
 * Render the Edit Car Stage View
 */
const editCarStageView = catchAsync(async (req, res) => {
  const carStage = await carStageService.getCarStageByUuid(req.params.uuid);
  res.render("pages/car-stage/edit", {
    carStage,
    title: "Car Stage",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

/**
 * Update a Car Stage
 */
const editCarStage = catchAsync(async (req, res) => {
  const carStage = await carStageService.editCarStage(
    req.params.uuid,
    req.body
  );
  res.status(httpStatus.OK).send(carStage);
});

module.exports = {
  carStageView,
  getCarStages,
  createCarStage,
  deleteCarStage,
  editCarStageView,
  editCarStage,
  carStageCreateView,
};
