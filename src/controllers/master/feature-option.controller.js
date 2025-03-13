const featureOptionView = (req, res) => {
  return res.render("pages/feature-option/create", {
    title: "Dashboard",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

module.exports = {
  featureOptionView,
};
