const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { websiteCustomerController } = require("../../controllers");

router.get(
  "/",
  auth({ permission: "" }),
  websiteCustomerController.websiteCustomerView
);

router.get(
  "/all",
  auth({ permission: "" }),
  websiteCustomerController.getWebsiteCustomer
);

module.exports = router;
