const httpStatus = require("http-status");
const { evStationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { SpecificationCategory, State, City } = require("../db/models");

/**
 * Get models by brand ID
 */
const getCitiesByState = catchAsync(async (req, res) => {
  const { stateId } = req.params;
  const cities = await evStationService.getCitiesByState(stateId);

  if (cities.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, cities });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No cities found for the selected state",
    });
  }
});

const evStationView = (req, res, next) => {
  return res.render("pages/ev-station/view", {
    title: "Ev Station",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const evStationCreateView = async (req, res, next) => {
  const states = await State.findAll();
  return res.render("pages/ev-station/create", {
    title: "Specification",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    states,
  });
};

const editEvStationView = catchAsync(async (req, res, next) => {
  const states = await State.findAll();
  const cities = await City.findAll();

  const evStation = await evStationService.getEvStationByUuid(req.params.uuid);

  return res.render("pages/ev-station/edit", {
    title: "specification",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    evStation: evStation.dataValues,
    states,
    cities,
  });
});

const createEvStation = async (req, res, next) => {
  const evStations = await evStationService.createEvStation(req.user, req.body);
  return res.status(httpStatus.CREATED).send(evStations);
};

const getEvStations = catchAsync(async (req, res, next) => {
  try {
    const evStations = await evStationService.queryEvStaions(req.query);
    res.status(httpStatus.OK).send(evStations);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

const toggleEvStationStatus = catchAsync(async (req, res, next) => {
  const evStation = await evStationService.toggleEvStationStatus(
    req.params.uuid
  );
  return res.status(httpStatus.OK).send(evStation);
});

const updateEvStation = catchAsync(async (req, res, next) => {
  const evStations = await evStationService.updateEvStation(
    req.params.uuid,
    req.body
  );
  return res.status(httpStatus.OK).send(evStations);
});

const deleteEvStation = catchAsync(async (req, res, next) => {
  await evStationService.deleteEvStation(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

// <-------------------------------- import module ----------------------------------------->
const evStationImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/ev-station/import/create", {
      title: "Ev Station Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const evStationImport = catchAsync(async (req, res, next) => {
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
    // await fuelStationService.bulkCreateFuelStation(req.user, rows);

    return res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
// <-------------------------------- import module ----------------------------------------->

module.exports = {
  evStationView,
  evStationCreateView,
  getCitiesByState,
  createEvStation,
  getEvStations,
  toggleEvStationStatus,
  deleteEvStation,
  editEvStationView,
  updateEvStation,
  evStationImportView,
  evStationImport,
};
