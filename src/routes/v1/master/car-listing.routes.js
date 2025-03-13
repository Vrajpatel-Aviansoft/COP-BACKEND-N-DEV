const express = require("express");
const router = express.Router();
const { carListingController } = require("../../../controllers");

router.get("/create", carListingController.carListingView);

module.exports = router;
