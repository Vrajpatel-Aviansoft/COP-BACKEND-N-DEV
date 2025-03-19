const httpStatus = require("http-status");
const { serviceStationService, brandService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { State, City, Brand } = require("../db/models");
const { readXlsxFromBuffer } = require("../utils/xlsxReader");
const { validateData } = require("../validations/imports/data-validator");
const {
  serviceStationValidationRules,
} = require("../validations/imports/rules/service-station-cols");

/**
 * Get models by brand ID
 */
const getCitiesByState = catchAsync(async (req, res) => {
  const { stateId } = req.params;
  const cities = await serviceStationService.getCitiesByState(stateId);

  if (cities.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, cities });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No cities found for the selected state",
    });
  }
});

const serviceStationView = (req, res, next) => {
  return res.render("pages/service-station/view", {
    title: "Service Station",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const serviceStationCreateView = async (req, res, next) => {
  const states = await State.findAll();
  const brands = await brandService.getBrands();
  return res.render("pages/service-station/create", {
    title: "Service Station",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    states,
    brands,
  });
};

const editServiceStationView = catchAsync(async (req, res, next) => {
  const states = await State.findAll();
  const cities = await City.findAll();
  const brands = await brandService.getBrands();

  const station = await serviceStationService.getServiceStationByUuid(
    req.params.uuid
  );

  return res.render("pages/service-station/edit", {
    title: "Service Station",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    station: station.dataValues,
    states,
    cities,
    brands,
  });
});

const createServiceStation = async (req, res, next) => {
  const serviceStations = await serviceStationService.createServiceStation(
    req.user,
    req.body
  );
  return res.status(httpStatus.CREATED).send(serviceStations);
};

const getServiceStations = catchAsync(async (req, res, next) => {
  try {
    const serviceStations = await serviceStationService.queryServiceStations(
      req.query
    );
    res.status(httpStatus.OK).send(serviceStations);
  } catch (error) {
    console.error("Error in getServiceStations:", error);
    next(error);
  }
});

const toggleServiceStationStatus = catchAsync(async (req, res, next) => {
  const serviceStation = await serviceStationService.toggleServiceStationStatus(
    req.params.uuid
  );
  return res.status(httpStatus.OK).send(serviceStation);
});

const updateServiceStation = catchAsync(async (req, res, next) => {
  const serviceStations = await serviceStationService.updateServiceStation(
    req.params.uuid,
    req.body
  );
  return res.status(httpStatus.OK).send(serviceStations);
});

const deleteServiceStation = catchAsync(async (req, res, next) => {
  await serviceStationService.deleteServiceStation(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

// <-------------------------------- import module ----------------------------------------->

const serviceStationImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/service-station/import/create", {
      title: "Service Station Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const serviceStationImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(rows, serviceStationValidationRules);
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const serviceStation = await serviceStationService.bulkCreateServiceStation(
      req.user,
      rows
    );

    return res.json({
      success: true,
      data: serviceStation,
    });
  } catch (error) {
    next(error);
  }
});

// <-------------------------------- import module ----------------------------------------->

module.exports = {
  serviceStationView,
  serviceStationCreateView,
  getCitiesByState,
  createServiceStation,
  getServiceStations,
  toggleServiceStationStatus,
  deleteServiceStation,
  editServiceStationView,
  updateServiceStation,
  serviceStationImportView,
  serviceStationImport,
};
