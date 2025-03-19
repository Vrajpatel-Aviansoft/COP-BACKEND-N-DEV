const standardUnitView = (req, res) => {
  return res.render("pages/standard-unit/create", {
    title: "Dashboard",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

module.exports = {
  standardUnitView,
};
