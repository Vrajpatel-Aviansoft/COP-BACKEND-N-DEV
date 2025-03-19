const express = require("express");
const router = express.Router();
const { reviewController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/file");

// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import",
  auth({ permission: "" }),
  reviewController.reviewImportView
);

router.post(
  "/import",
  auth({ permission: "" }),
  upload.single("file"),
  reviewController.reviewImport
);

// <-------------------------------- import module ----------------------------------------->


router.get(
  "/",
  auth({ permission: "view_review" }),
  reviewController.reviewView
);


router.get("/all", reviewController.getReview);


module.exports = router;
