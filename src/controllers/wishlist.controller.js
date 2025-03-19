const httpStatus = require("http-status");
const { wishlistService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const wishlistView = (req, res, next) => {
  return res.render("pages/wishlist/view", {
    title: "Wishlist",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

const getWishlist = catchAsync(async (req, res, next) => {
  try {
    const websiteCustomers = await wishlistService.queryWishlist(
      req.query
    );
    res.status(httpStatus.OK).send(websiteCustomers);
  } catch (error) {
    console.error("Error in getBrands:", error);
    next(error);
  }
});

module.exports = {
  wishlistView,
  getWishlist,
};
