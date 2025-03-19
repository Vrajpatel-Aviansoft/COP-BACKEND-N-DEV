const httpStatus = require("http-status");
const { allTaxService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const { City, TaxValue } = require("../../db/models");

const AllTaxView = async (req, res, next) => {
  return res.render("pages/all-tax/view", {
    title: "All Tax",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const allTaxCreateView = async (req, res, next) => {
  const cities = await City.findAll();
  return res.render("pages/all-tax/create", {
    title: "All Tax",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    cities,
  });
};

const editAllTaxView = catchAsync(async (req, res, next) => {
  const allTax = await allTaxService.getTaxByUuid(req.params.uuid);

  const cities = await City.findAll();
  const taxValues = await TaxValue.findAll({
    raw: true,
    where: { tax_id: allTax.dataValues.tax_id },
  });

  return res.render("pages/all-tax/edit", {
    title: "All Tax",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
    allTax: allTax.dataValues,
    cities,
    taxValues,
  });
});

const createAllTax = async (req, res, next) => {
  const allTax = await allTaxService.createTax(req.user, req.body);
  return res.status(httpStatus.CREATED).send(allTax);
};

const getAllTaxes = catchAsync(async (req, res, next) => {
  try {
    const allTaxes = await allTaxService.queryTaxes(req.query);
    res.status(httpStatus.OK).send(allTaxes);
  } catch (error) {
    console.error("Error in getAllTaxes:", error);
    next(error);
  }
});

const toggleAllTaxStatus = catchAsync(async (req, res, next) => {
  const brand = await allTaxService.toggleTaxStatus(req.params.uuid);
  return res.status(httpStatus.OK).send(brand);
});

const updateAllTax = catchAsync(async (req, res, next) => {
  const allTax = await allTaxService.updateTax(req.params.uuid, req.body);
  return res.status(httpStatus.OK).send(allTax);
});

const deleteAllTax = catchAsync(async (req, res, next) => {
  await allTaxService.deleteTax(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  AllTaxView,
  allTaxCreateView,
  createAllTax,
  getAllTaxes,
  toggleAllTaxStatus,
  deleteAllTax,
  editAllTaxView,
  updateAllTax,
};
