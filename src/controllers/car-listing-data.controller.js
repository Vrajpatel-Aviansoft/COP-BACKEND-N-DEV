const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  brandService,
  carModelService,
  carListingDataService,
} = require("../services");

const carListingDataView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/car-listing-data/view", {
      title: "Car Listing Data View",
      layout: "./layouts/main",
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
const carListingDataCreateView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  const carListing = await carListingDataService.getCarListing();
  return res.render("pages/car-listing-data/create", {
    title: "Create Car Listing Data",
    layout: "./layouts/main",
    brands: brands.data,
    carListing,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
  });
});

/**
 * Create a new variant
 */
const createCarListingData = catchAsync(async (req, res, next) => {
  try {
    await carListingDataService.createCarListingData(req.body, req.user);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Car listing data created successfully",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Query car listing data
 */
const getCarListingData = catchAsync(async (req, res) => {
  const carListingData = await carListingDataService.queryCarListingData(
    req.query
  );
  return res.status(httpStatus.OK).send(carListingData);
});

/**
 * Render the variant edit view
 */
const editCarListingDataView = catchAsync(async (req, res) => {
  const brands = await brandService.queryBrands();
  const carListings = await carListingDataService.getCarListing();
  const carListingData = await carListingDataService.getCarListingDataByUuid(
    req.params.uuid
  );
  const models = await carModelService.getCarModelsByBrandId(
    carListingData.brand_id
  );
  return res.render("pages/car-listing-data/edit", {
    title: "Edit Car Listing Data",
    layout: "./layouts/main",
    brands: brands.data,
    sidebarItems: req.sidebarItems,
    currentRoute: req.originalUrl,
    carListingData,
    models,
    carListings,
  });
});

const updateCarListingData = catchAsync(async (req, res) => {
  const carListingData = await carListingDataService.updateCarListingData(
    req.params.uuid,
    req.body,
    req.user
  );
  return res.status(httpStatus.OK).send(carListingData);
});

const toggleStatus = catchAsync(async (req, res) => {
  await carListingDataService.toggleStatus(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

const deleteCarListingData = catchAsync(async (req, res) => {
  await carListingDataService.deleteCarListingData(req.params.uuid);
  return res.status(httpStatus.OK).send({ success: true });
});

module.exports = {
  createCarListingData,
  carListingDataCreateView,
  carListingDataView,
  getCarListingData,
  editCarListingDataView,
  updateCarListingData,
  deleteCarListingData,
  toggleStatus,
};
