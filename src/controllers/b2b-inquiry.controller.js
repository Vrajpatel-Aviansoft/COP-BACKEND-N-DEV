const httpStatus = require("http-status");
const { b2binquiryService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const b2bInquiryView = (req, res, next) => {
  return res.render("pages/b2b-inquiry/view", {
    title: "B2B Inquiry",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const getB2BInquiry = catchAsync(async (req, res, next) => {
  try {
    const b2bInquirys = await b2binquiryService.queryB2BInquiry(
      req.query
    );
    res.status(httpStatus.OK).send(b2bInquirys);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

module.exports = {
  b2bInquiryView,
  getB2BInquiry,
};
