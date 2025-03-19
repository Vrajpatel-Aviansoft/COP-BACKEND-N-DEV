const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { servicesLeadController } = require("../../controllers");

router.get(
  "/",
  auth({ permission: "" }),
  servicesLeadController.servicesLeadView
);

router.get(
  "/all",
  auth({ permission: "" }),
  servicesLeadController.getServicesLead
);

module.exports = router;
