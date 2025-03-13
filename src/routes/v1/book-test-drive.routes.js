const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { bookTestDriveController } = require("../../controllers");

router.get(
  "/",
  auth({ permission: "" }),
  bookTestDriveController.bookTestDriveView
);

router.get(
  "/all",
  auth({ permission: "" }),
  bookTestDriveController.getBookTestDrive
);

// // Update booking status
// router.post("/update-status", updateBookingStatus);

// // Get status modal data
// router.get("/status-model/:id", getStatusModel);

module.exports = router;
