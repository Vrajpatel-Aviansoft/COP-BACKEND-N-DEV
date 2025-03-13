// master routes
const express = require("express");
const router = express.Router();

const allTaxRoute = require("./all-tax.routes");
const iconRoute = require("./icon.routes");
const bannerCategoryRoute = require("./banner-category.routes");
const carListingRoute = require("./car-listing.routes");
const carGraphicTypeRoute = require("./cargraphic-type.routes");
const carStageRoute = require("./car-stage.routes");
const carTypeRoute = require("./car-type.routes");
const featureOptionRoute = require("./feature-option.routes");
const rtoRoute = require("./rto.routes");
const specificationCategoryRoute = require("./specification-category.routes");
const standardUnitRoute = require("./standard-unit.routes");

const variantRoute = require("../variant.routes")

router.use("/all-tax", allTaxRoute);
router.use("/icon", iconRoute);
router.use("/banner-cat", bannerCategoryRoute);
router.use("/car-listing", carListingRoute);
router.use("/car-graphic-type", carGraphicTypeRoute);
router.use("/car-stage", carStageRoute);
router.use("/car-type", carTypeRoute);
router.use("/feature-option", featureOptionRoute);
router.use("/rto", rtoRoute);
router.use("/specification-category", specificationCategoryRoute);
router.use("/standard-unit", standardUnitRoute);
router.use("/variant", variantRoute)

module.exports = router;
