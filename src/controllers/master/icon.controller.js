const iconView = (req, res) => {
  return res.render("pages/icon/create", {
    title: "Dashboard",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

module.exports = {
  iconView,
};
