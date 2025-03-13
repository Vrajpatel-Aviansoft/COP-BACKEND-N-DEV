const express = require("express");
const router = express.Router();
const { specificationCategoryController } = require("../../../controllers");

router.get("/", specificationCategoryController.specCategoryView);

module.exports = router;
