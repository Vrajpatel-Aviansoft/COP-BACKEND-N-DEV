const dashboardView = (req, res, next) => {
  return res.render("pages/dashboard", {
    title: "Dashboard",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

module.exports = {
  dashboardView,
};
