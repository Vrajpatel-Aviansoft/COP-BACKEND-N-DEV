const express = require("express");
const router = express.Router();
const { dashboardController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");

router.get("/", auth(), dashboardController.dashboardView);

module.exports = router;
