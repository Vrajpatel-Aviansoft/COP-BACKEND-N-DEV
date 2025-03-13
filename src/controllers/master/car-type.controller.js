const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { carTypeService } = require("../../services");
/**
 * Render the Car Type View
 */
const carTypeView = catchAsync(async (req, res) => {
  return res.render("pages/car-type/view", {
    title: "Car Type",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

const carTypeCreateView = catchAsync(async (req, res) => {
  return res.render("pages/car-type/create", {
    title: "Car Type",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new Car Type
 */
const createCarType = catchAsync(async (req, res) => {
  const carType = await carTypeService.createCarType(req.body);
  res.status(httpStatus.CREATED).send(carType);
});

/**
 * Get Car Types for DataTable
 */

const getCarTypes = catchAsync(async (req, res, next) => {
  try {
    const carTypes = await carTypeService.queryCarTypes(req.query);
    res.status(httpStatus.OK).send(carTypes);
  } catch (error) {
    console.error("Error in getCarTypes:", error);
    next(error);
  }
});

/**
 * Delete a Car Type
 */
const deleteCarType = catchAsync(async (req, res) => {
  await carTypeService.deleteCarType(req.params.uuid);
  res.sendStatus(httpStatus.OK);
});

/**
 * Render the Edit Car Type View
 */
const editCarTypeView = catchAsync(async (req, res) => {
  const carType = await carTypeService.getCarTypeByUuid(req.params.uuid);
  res.render("pages/car-type/edit", {
    carType,
    title: "Car Type",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
  });
});

/**
 * Update a Car Type
 */
const editCarType = catchAsync(async (req, res) => {
  const carType = await carTypeService.editCarType(req.params.uuid, req.body);
  res.status(httpStatus.OK).send(carType);
});

module.exports = {
  carTypeView,
  getCarTypes,
  createCarType,
  deleteCarType,
  editCarTypeView,
  editCarType,
  carTypeCreateView,
};
