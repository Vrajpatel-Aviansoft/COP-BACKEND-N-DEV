const express = require("express");
const router = express.Router();
const { featureOptionController } = require("../../../controllers");

router.get("/", featureOptionController.featureOptionView);

module.exports = router;
