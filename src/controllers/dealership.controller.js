const httpStatus = require("http-status");
const { dealerShipService, brandService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { State, City } = require("../db/models");
const { readXlsxFromBuffer } = require("../utils/xlsxReader");
const { validateData } = require("../validations/imports/data-validator");

const {
  dealershipValidationRules,
} = require("../validations/imports/rules/dealership-rules");

const getCitiesByState = catchAsync(async (req, res) => {
  const { stateId } = req.params;
  const cities = await dealerShipService.getCitiesByState(stateId);

  if (cities.length > 0) {
    return res.status(httpStatus.OK).json({ success: true, cities });
  } else {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No cities found for the selected state",
    });
  }
});

const dealerShipView = (req, res, next) => {
  return res.render("pages/dealership/view", {
    title: "Dealership",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    // brands,
  });
};

const dealerShipCreateView = async (req, res, next) => {
  const states = await State.findAll();
  const brands = await brandService.getBrands();

  return res.render("pages/dealership/create", {
    title: "Dealership",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    states,
    brands,
  });
};

const editDealerShipView = catchAsync(async (req, res, next) => {
  const brands = await brandService.getBrands();

  const states = await State.findAll();
  const cities = await City.findAll();

  const dealerShip = await dealerShipService.getDealerShipByUuid(
    req.params.uuid
  );

  return res.render("pages/dealership/edit", {
    title: "Dealership",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    dealerShip: dealerShip.dataValues,
    states,
    cities,
    brands,
  });
});

const createDealerShip = async (req, res, next) => {
  const dealerShips = await dealerShipService.createDealerShip(
    req.user,
    req.body
  );
  return res.status(httpStatus.CREATED).send(dealerShips);
};

const getDealerShip = catchAsync(async (req, res, next) => {
  try {
    const dealerShips = await dealerShipService.queryDealerShip(req.query);
    res.status(httpStatus.OK).send(dealerShips);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

const toggleDealerShipStatus = catchAsync(async (req, res, next) => {
  const dealerShip = await dealerShipService.toggleDealerShipStatus(
    req.params.uuid
  );
  return res.status(httpStatus.OK).send(dealerShip);
});

const updateDealerShip = catchAsync(async (req, res, next) => {
  const dealerShips = await dealerShipService.updateDealerShip(
    req.params.uuid,
    req.body
  );
  return res.status(httpStatus.OK).send(dealerShips);
});

const deleteDealerShip = catchAsync(async (req, res, next) => {
  await dealerShipService.deleteDealerShip(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

// <-------------------------------- import module ----------------------------------------->

const dealerShipImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/dealership/import/create", {
      title: "Dealership Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const dealerShipImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);

    const validationErrors = validateData(rows, dealershipValidationRules);
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const dealerShip = await dealerShipService.bulkCreateDealership(
      req.user,
      rows
    );

    return res.json({
      success: true,
      data: dealerShip,
    });
  } catch (error) {
    next(error);
  }
});

// <-------------------------------- import module ----------------------------------------->

module.exports = {
  dealerShipView,
  dealerShipCreateView,
  getCitiesByState,
  createDealerShip,
  getDealerShip,
  toggleDealerShipStatus,
  deleteDealerShip,
  editDealerShipView,
  updateDealerShip,
  dealerShipImportView,
  dealerShipImport,
};
