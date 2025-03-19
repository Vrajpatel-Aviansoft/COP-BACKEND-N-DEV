const express = require("express");
const router = express.Router();
const { carGraphicTypeController } = require("../../../controllers");

router.get("/", carGraphicTypeController.carGraphicTypeView);

module.exports = router;
