const httpStatus = require("http-status");
const { subscribeService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const subscribeView = (req, res, next) => {
  return res.render("pages/subscribe/view", {
    title: "Subscribe",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const getSubscribe = catchAsync(async (req, res, next) => {
  try {
    const subscribes = await subscribeService.querySubscribe(
      req.query
    );
    res.status(httpStatus.OK).send(subscribes);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

const deleteSubscribe = catchAsync(async (req, res, next) => {
  await subscribeService.deleteSubscribe(req.params.uuid);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  subscribeView,
  getSubscribe,
  deleteSubscribe,
};
