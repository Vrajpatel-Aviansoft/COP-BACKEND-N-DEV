const express = require("express");
const { carListingDataController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const upload = require("../../middlewares/file");

router.get(
  "/create",
  auth(),
  carListingDataController.carListingDataCreateView
);
router.get(
  "/all",
  auth({ isView: false, permission: "view_car_listing_data" }),
  carListingDataController.getCarListingData
);
router.get(
  "/",
  auth({ permission: "view_car_listing_data" }),
  carListingDataController.carListingDataView
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_car_listing_data" }),
  carListingDataController.editCarListingDataView
);

router.post(
  "/create",
  auth({ isView: false, permission: "create_car_listing_data" }),
  // validate(brandValidation.createBrand),
  upload.any(),
  carListingDataController.createCarListingData
);

router.put(
  "/:uuid",
  auth({ permission: "edit_car_listing_data" }),
  upload.any(),
  carListingDataController.updateCarListingData
);

router.patch(
  "/:uuid/status",
  auth({ permission: "edit_car_listing_data" }),
  carListingDataController.toggleStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "delete_car_listing_data" }),
  carListingDataController.deleteCarListingData
);

module.exports = router;
