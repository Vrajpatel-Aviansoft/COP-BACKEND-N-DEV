const express = require("express");

const router = express.Router();
const { iconController } = require("../../../controllers");

router.get("/", iconController.iconView);

module.exports = router;
