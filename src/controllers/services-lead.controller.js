const httpStatus = require("http-status");
const { servicesLeadService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const servicesLeadView = (req, res, next) => {
  return res.render("pages/services-lead/view", {
    title: "Services Lead",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const getServicesLead = catchAsync(async (req, res, next) => {
  try {
    const servicesLeads = await servicesLeadService.queryServicesLead(
      req.query
    );
    res.status(httpStatus.OK).send(servicesLeads);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

module.exports = {
  servicesLeadView,
  getServicesLead,
};
