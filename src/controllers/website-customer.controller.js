const httpStatus = require("http-status");
const { websiteCustomerService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const websiteCustomerView = (req, res, next) => {
  return res.render("pages/website-customer/view", {
    title: "Website Customer",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const getWebsiteCustomer = catchAsync(async (req, res, next) => {
  try {
    const websiteCustomers = await websiteCustomerService.queryWebsiteCustomer(
      req.query
    );
    res.status(httpStatus.OK).send(websiteCustomers);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

module.exports = {
  websiteCustomerView,
  getWebsiteCustomer,
};
