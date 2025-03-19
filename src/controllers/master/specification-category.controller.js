const specCategoryView = (req, res) => {
  return res.render("pages/specification-category/create", {
    title: "Dashboard",
    layout: "./layouts/main",
    currentRoute: req.originalUrl,
    sidebarItems: req.sidebarItems,
  });
};

module.exports = {
  specCategoryView,
};
