const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { b2bInquiryController } = require("../../controllers");

router.get("/", auth({ permission: "" }), b2bInquiryController.b2bInquiryView);

router.get(
  "/all",
  auth({ permission: "" }),
  b2bInquiryController.getB2BInquiry
);

module.exports = router;
