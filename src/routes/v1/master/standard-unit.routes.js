const express = require("express");
const router = express.Router();

const { standardUnitController } = require("../../../controllers");

router.get("/", standardUnitController.standardUnitView);

module.exports = router;
