const httpStatus = require("http-status");
const { reviewService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { readXlsxFromBuffer } = require("../utils/xlsxReader");
const { validateData } = require("../validations/imports/data-validator");
const {
  reviewValidationRules,
} = require("../validations/imports/rules/review-rules");

// <-------------------------------- import module ----------------------------------------->

const reviewImportView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/review/import/create", {
      title: "Review Import",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});

const reviewImport = catchAsync(async (req, res, next) => {
  try {
    const file = req.file;
    const rows = readXlsxFromBuffer(file.buffer);
    const validationErrors = validateData(rows, reviewValidationRules);
    if (validationErrors.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        errors: validationErrors,
      });
    }
    const reviews = await reviewService.bulkCreateReview(req.user, rows);

    return res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

// <-------------------------------- import module ----------------------------------------->

const reviewView = catchAsync(async (req, res) => {
  try {
    return res.render("pages/review/view", {
      title: "Review View",
      layout: "./layouts/main",
      sidebarItems: req.sidebarItems,
      currentRoute: req.originalUrl,
    });
  } catch (error) {
    next(error);
  }
});


const getReview = catchAsync(async (req, res, next) => {
  try {
    const reviews = await reviewService.queryReview(req.query);
    res.status(httpStatus.OK).send(reviews);
  } catch (error) {
    console.error("Error in getReviews:", error);
    next(error);
  }
});


module.exports = {
  reviewImport,
  reviewImportView,
  reviewView,
  getReview,
};
