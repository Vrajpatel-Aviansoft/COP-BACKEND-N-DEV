const httpStatus = require("http-status");
const { bookTestDriveService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const bookTestDriveView = (req, res, next) => {
  return res.render("pages/book-test-drive/view", {
    title: "Book Test Drive",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const getBookTestDrive = catchAsync(async (req, res, next) => {

  try {
    const bookTestDrives = await bookTestDriveService.queryBookTestDrive(
      req.query
    );
    res.status(httpStatus.OK).send(bookTestDrives);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

module.exports = {
  bookTestDriveView,
  getBookTestDrive,
};
