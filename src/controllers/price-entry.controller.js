const httpStatus = require('http-status');
const { priceEntryService, brandService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const { Country, State, City } = require('../db/models');
const { readXlsxFromBuffer } = require('../utils/xlsxReader');
const { validateData } = require('../validations/imports/data-validator');

const {
  priceEntryValidationRules,
} = require('../validations/imports/rules/price-entry-rules');

/**
 * Get models by brand ID
 */
// const getCitiesByState = catchAsync(async (req, res) => {
//   const { stateId } = req.params;
//   const cities = await evStationService.getCitiesByState(stateId);

//   if (cities.length > 0) {
//     return res.status(httpStatus.OK).json({ success: true, cities });
//   } else {
//     return res.status(httpStatus.NOT_FOUND).json({
//       success: false,
//       message: "No cities found for the selected state",
//     });
//   }
// });

const getModelsByBrand = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const models = await priceEntryService.getModelsByBrand(uuid);

  if (models.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, models });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'No models found for the selected brand',
    });
  }
});

const getVariantsByModel = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const variants = await priceEntryService.getVariantsByModel(uuid);

  if (variants.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, variants });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'No variants found for the selected model',
    });
  }
});

const getStatesByCountry = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const states = await priceEntryService.getStatesByCountry(uuid);

  if (states.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, states });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'No states found for the selected country',
    });
  }
});

const getCitiesByState = catchAsync(async (req, res) => {
  const { uuid } = req.params;
  const citys = await priceEntryService.getCitiesByState(uuid);

  if (citys.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, citys });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'No cities found for the selected state',
    });
  }
});

const priceEntryView = (req, res, next) => {
  return res.render('pages/price-entry/view', {
    title: 'Price Entry',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const priceEntryCreateView = async (req, res, next) => {
  const brands = await brandService.getBrands();
  const country = await Country.findAll();
  return res.render('pages/price-entry/create', {
    title: 'Price Entry',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    brands,
    country,
  });
};

const calculatePrice = async (req, res, next) => {
  const { state_id, ex_showroom_price, model_id, variant_id, taxId, city_ids } =
    req.body;

  try {
    // Call the service function with the extracted data
    const priceDetails = await priceEntryService.calculatePrice({
      state_id,
      ex_showroom_price,
      model_id,
      variant_id,
      taxId,
      city_ids,
    });

    res.status(httpStatus.OK).json({ success: true, priceDetails });
  } catch (error) {
    console.error('Error in calculatePrice controller:', error);
    next(error); // Pass error to error handler for handling
  }
};

const calculateTax = async (req, res, next) => {
  const { taxId, exShorRoomPrice } = req.body;

  try {
    const taxDetails = await priceEntryService.calculateTax(
      taxId,
      exShorRoomPrice
    );
    res.status(httpStatus.OK).json({ success: true, taxDetails });
  } catch (error) {
    console.error('Error in calculate Tax controller:', error);
    next(error); // Pass error to error handler for handling
  }
};

// const editEvStationView = catchAsync(async (req, res, next) => {
//   const states = await State.findAll();
//   const cities = await City.findAll();

//   const evStation = await evStationService.getEvStationByUuid(req.params.uuid);

//   return res.render("pages/ev-station/edit", {
//     title: "specification",
//     layout: "./layouts/main",
//     currentRoute: req.originalUrl,
//     sidebarItems: req.sidebarItems,
//     evStation: evStation.dataValues,
//     states,
//     cities,
//   });
// });

// const createEvStation = async (req, res, next) => {
//   const evStations = await evStationService.createEvStation(req.user, req.body);
//   return res.status(httpStatus.CREATED).send(evStations);
// };

const getPriceEntries = catchAsync(async (req, res, next) => {
  try {
    const PriceEntries = await priceEntryService.queryPriceEntries(req.query);
    res.status(httpStatus.OK).send(PriceEntries);
  } catch (error) {
    console.error('Error in getBrands:', error);
    next(error);
  }
});

// const toggleEvStationStatus = catchAsync(async (req, res, next) => {
//   const evStation = await evStationService.toggleEvStationStatus(
//     req.params.uuid
//   );
//   return res.status(httpStatus.OK).send(evStation);
// });

// const updateEvStation = catchAsync(async (req, res, next) => {
//   const evStations = await evStationService.updateEvStation(
//     req.params.uuid,
//     req.body
//   );
//   return res.status(httpStatus.OK).send(evStations);
// });

// const deleteEvStation = catchAsync(async (req, res, next) => {
//   await evStationService.deleteEvStation(req.params.uuid);
//   return res.status(httpStatus.NO_CONTENT).send();
// });

// <--------------------------------Non Ev Upcoming import module Start----------------------------------------->

const priceImportView = catchAsync(async (req, res) => {
  return res.render('pages/price-entry/import/create', {
    title: 'Price Entry Import',
    layout: './layouts/main',
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
});

const priceImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(rows, priceEntryValidationRules);
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const priceEntries = await priceEntryService.bulkCreatePrice(
      req.user,
      rows
    );

    return res.json({
      success: true,
      data: priceEntries,
    });
  } catch (error) {
    next(error);
  }
});

// <--------------------------------Non Ev Upcoming import module End----------------------------------------->

module.exports = {
  getModelsByBrand,
  getVariantsByModel,
  getStatesByCountry,
  priceEntryView,
  priceEntryCreateView,
  getCitiesByState,
  calculatePrice,
  calculateTax,
  // getCitiesByState,
  // createEvStation,
  getPriceEntries,
  // toggleEvStationStatus,
  // deleteEvStation,
  // editEvStationView,
  // updateEvStation,
  priceImportView,
  priceImport,
};
