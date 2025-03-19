const carGraphicTypeView = (req, res) => {
  return res.render("pages/cargraphic-type/create", {
    title: "Dashboard",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

module.exports = {
  carGraphicTypeView,
};
