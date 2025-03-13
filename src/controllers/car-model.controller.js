const httpStatus = require('http-status');
const {
  carStageService,
  carTypeService,
  brandService,
  carModelService,
} = require('../services');
const { Rating, RatingType, MSD } = require('../db/models');
const catchAsync = require('../utils/catchAsync');
const { readXlsxFromBuffer } = require('../utils/xlsxReader');
const { validateData } = require('../validations/imports/data-validator');
const {
  carModelLaunchedValidationRules,
  carModelUpcomingValidationRules,
  carModelEvLaunchedValidationRules,
  carModelEvUpcomingValidationRules,
} = require('../validations/imports/rules/car-model-rules');

// <-------------------------------- import module ----------------------------------------->

// <--------------------------------Non Ev Launched import module Start----------------------------------------->

const carModelNonEvLaunchedImportView = catchAsync(async (req, res) => {
  return res.render('pages/car-model/import/non-ev/launched/create', {
    title: 'Car Model Import(Launched)',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
});

const carModelNonEvLaunchedImport = catchAsync(async (req, res, next) => {
  const file = req.file;
  const rows = readXlsxFromBuffer(file.buffer);
  const validationErrors = validateData(rows, carModelLaunchedValidationRules);
  if (validationErrors.length > 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      errors: validationErrors,
    });
  }
  const carModelNonEvLaunched =
    await carModelService.bulkCreateModelNonEvLaunched(req.user, rows);

  return res.json({
    success: true,
    data: carModelNonEvLaunched,
  });
});

// <--------------------------------Non Ev Launched import module End----------------------------------------->

// <--------------------------------Non Ev Upcoming import module Start----------------------------------------->

const carModelNonEvUpcomingImportView = catchAsync(async (req, res) => {
  return res.render('pages/car-model/import/non-ev/upcoming/create', {
    title: 'Car Model Import(Upcoming)',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
});

const carModelNonEvUpcomingImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(
      rows,
      carModelUpcomingValidationRules
    );
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const carModelNonEvLaunched =
      await carModelService.bulkCreateModelNonEvUpcoming(req.user, rows);

    return res.json({
      success: true,
      data: carModelNonEvLaunched,
    });
  } catch (error) {
    next(error);
  }
});

// <--------------------------------Non Ev Upcoming import module End----------------------------------------->

// <-------------------------------- Ev Launched import module Start----------------------------------------->

const carModelEvLaunchedImportView = catchAsync(async (req, res) => {
  return res.render('pages/car-model/import/ev/launched/create', {
    title: 'Car Model Import(Launched)',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
});

const carModelEvLaunchedImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(
      rows,
      carModelEvLaunchedValidationRules
    );
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const carModelEvLaunched = await carModelService.bulkCreateModelEvLaunched(
      req.user,
      rows
    );

    return res.json({
      success: true,
      data: carModelEvLaunched,
    });
  } catch (error) {
    next(error);
  }
});

// <-------------------------------- Ev Launched import module End----------------------------------------->

// <-------------------------------- Ev Upcoming import module Start----------------------------------------->

const carModelEvUpcomingImportView = catchAsync(async (req, res) => {
  return res.render('pages/car-model/import/ev/upcoming/create', {
    title: 'Car Model Import(Upcoming)',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
});

const carModelEvUpcomingImport = catchAsync(async (req, res, next) => {
  const file = req.file;
  const rows = readXlsxFromBuffer(file.buffer);
  const validationErrors = validateData(
    rows,
    carModelEvUpcomingValidationRules
  );
  if (validationErrors.length > 0) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      errors: validationErrors,
    });
  }
  const carModelEvUpcoming = await carModelService.bulkCreateModelEvUpcoming(
    req.user,
    rows
  );

  return res.json({
    success: true,
    data: carModelEvUpcoming,
  });
});

// <-------------------------------- Ev Upcoming import module End----------------------------------------->

// <-------------------------------- import module ----------------------------------------->

const carModelView = catchAsync(async (req, res, next) => {
  return res.render('pages/car-model/view', {
    title: 'Car Model',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
});

const carModelCreateView = catchAsync(async (req, res, next) => {
  const carStages = await carStageService.queryCarStages();
  const carTypes = await carTypeService.queryCarTypes();
  const brands = await brandService.queryBrands();
  return res.render('pages/car-model/create', {
    title: 'Car Model',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    carStages: carStages.data,
    carTypes: carTypes.data,
    brands: brands.data,
  });
});

const editCarModelView = catchAsync(async (req, res, next) => {
  const carModel = await carModelService.getCarModelByUuid(req.params.uuid);
  const carStages = await carStageService.queryCarStages();
  const carTypes = await carTypeService.queryCarTypes();
  const brands = await brandService.queryBrands();

  const ratingValue = await Rating.findOne({
    where: { model_id: carModel.model_id },
  });

  let ratingType = null;

  if (ratingValue) {
    ratingType = await RatingType.findOne({
      where: { rating_type_id: ratingValue.rating_type_id },
    });
  }

  const msdField = await MSD.findOne({
    where: { model_id: carModel.model_id },
  });

  return res.render('pages/car-model/edit', {
    title: 'Car Model',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    model: carModel.dataValues,
    carStages: carStages.data,
    carTypes: carTypes.data,
    brands: brands.data,
    msdFields: msdField,
    ratingValue: ratingValue || null,
    ratingType: ratingType || null,
  });
});

const createCarModel = catchAsync(async (req, res, next) => {
  const carModel = await carModelService.createCarModel(
    req.user,
    req.body,
    req.files
  );
  return res.status(httpStatus.CREATED).send(carModel);
});

const getCarModels = catchAsync(async (req, res, next) => {
  const carModels = await carModelService.queryCarModels(req.query);
  res.status(httpStatus.OK).send(carModels);
});

const toggleCarModelStatus = catchAsync(async (req, res, next) => {
  const carModel = await carModelService.toggleCarModelStatus(
    req.params.uuid,
    req.body.type
  );
  return res.status(httpStatus.OK).send(carModel);
});

const updateCarModel = catchAsync(async (req, res, next) => {
  const carModel = await carModelService.updateCarModel(
    req.params.uuid,
    req.body,
    req.files,
    req.user
  );
  return res.status(httpStatus.OK).send(carModel);
});

const deleteCarModel = catchAsync(async (req, res, next) => {
  await carModelService.deleteCarModel(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  carModelView,
  carModelCreateView,
  createCarModel,
  getCarModels,
  toggleCarModelStatus,
  deleteCarModel,
  editCarModelView,
  updateCarModel,
  carModelNonEvLaunchedImportView,
  carModelNonEvLaunchedImport,
  carModelNonEvUpcomingImportView,
  carModelNonEvUpcomingImport,
  carModelEvLaunchedImportView,
  carModelEvLaunchedImport,
  carModelEvUpcomingImportView,
  carModelEvUpcomingImport,
};
