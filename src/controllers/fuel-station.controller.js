const httpStatus = require("http-status");
const { fuelStationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { State, City } = require("../db/models");
const {
  fuelStationValidationRules,
} = require("../validations/imports/rules/station-rules");
const { readXlsxFromBuffer } = require("../utils/xlsxReader");
const { validateData } = require("../validations/imports/data-validator");

/**
 * Get models by brand ID
 */
const getCitiesByState = catchAsync(async (req, res) => {
  const { stateId } = req.params;
  const cities = await fuelStationService.getCitiesByState(stateId);

  if (cities.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, cities });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No cities found for the selected state",
    });
  }
});

const fuelStationView = (req, res, next) => {
  return res.render("pages/fuel-station/view", {
    title: "Fuel Station",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const fuelStationCreateView = async (req, res, next) => {
  const states = await State.findAll();
  return res.render("pages/fuel-station/create", {
    title: "Fuel Station",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    states,
  });
};

const editFuelStationView = catchAsync(async (req, res, next) => {
  const states = await State.findAll();
  const cities = await City.findAll();
  const station = await fuelStationService.getFuelStationByUuid(
    req.params.uuid
  );

  return res.render("pages/fuel-station/edit", {
    title: "Fuel Station",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    station: station.dataValues,
    states,
    cities,
  });
});

const createFuelStation = async (req, res, next) => {
  const fuelStations = await fuelStationService.createFuelStation(
    req.user,
    req.body
  );
  return res.status(httpStatus.CREATED).send(fuelStations);
};

const getFuelStations = catchAsync(async (req, res, next) => {
  try {
    const fuelStations = await fuelStationService.queryFuelStaions(req.query);
    res.status(httpStatus.OK).send(fuelStations);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

const toggleFuelStationStatus = catchAsync(async (req, res, next) => {
  const fuelStation = await fuelStationService.toggleFuelStationStatus(
    req.params.uuid
  );
  return res.status(httpStatus.OK).send(fuelStation);
});

const updateFuelStation = catchAsync(async (req, res, next) => {
  const fuelStations = await fuelStationService.updateFuelStation(
    req.params.uuid,
    req.body
  );
  return res.status(httpStatus.OK).send(fuelStations);
});

const deleteFuelStation = catchAsync(async (req, res, next) => {
  await fuelStationService.deleteFuelStation(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

// <-------------------------------- import module ----------------------------------------->
const fuelStationImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/fuel-station/import/create", {
      title: "Fuel Station Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const fuelStationImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(rows, fuelStationValidationRules);
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    await fuelStationService.bulkCreateFuelStation(req.user, rows);

    return res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
// <-------------------------------- import module ----------------------------------------->

module.exports = {
  fuelStationView,
  fuelStationCreateView,
  getCitiesByState,
  createFuelStation,
  getFuelStations,
  toggleFuelStationStatus,
  deleteFuelStation,
  editFuelStationView,
  updateFuelStation,
  fuelStationImportView,
  fuelStationImport,
};
