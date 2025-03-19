const carListingView = (req, res) => {
  return res.render("pages/car-listing/create", {
    title: "Dashboard",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

module.exports = {
  carListingView,
};
