const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { priceEntryController } = require("../../controllers");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");

// <-------------------------------- Price import module Start ----------------------------------------->

router.get(
  "/import/create",
  auth({ permission: "create_price_entry" }),
  priceEntryController.priceImportView
);

router.post(
  "/import/create",
  auth({ permission: "create_price_entry" }),
  upload.single("file"),
  priceEntryController.priceImport
);

// <-------------------------------- Price import module End ----------------------------------------->

router.get(
  "/",
  auth({ permission: "view_price_entry" }),
  priceEntryController.priceEntryView
);

router.get(
  "/create",
  auth({ permission: "create_price_entry" }),
  priceEntryController.priceEntryCreateView
);
router.get("/all", priceEntryController.getPriceEntries);

router.get("/model/:uuid/brand", priceEntryController.getModelsByBrand);
router.get("/variant/:uuid/model", priceEntryController.getVariantsByModel);
router.get("/state/:uuid/country", priceEntryController.getStatesByCountry);
router.get("/city/:uuid/state", priceEntryController.getCitiesByState);

router.post("/total-price", priceEntryController.calculatePrice);
router.post("/tax-cal", priceEntryController.calculateTax);

// router.get("/city/:stateId/state", evStationController.getCitiesByState);

// router.post(
//   "/create",
//   upload.none(),
//   auth({ isView: false, permission: "create_ev_station" }),
//   evStationController.createEvStation
// );
// router.patch(
//   "/:uuid/status",
//   auth({ isView: false, permission: "edit_ev_station" }),
//   evStationController.toggleEvStationStatus
// );
// router.delete(
//   "/:uuid",
//   auth({ permission: "delete_ev_station" }),
//   evStationController.deleteEvStation
// );
// router.get(
//   "/:uuid/edit",
//   auth({ permission: "edit_ev_station" }),
//   evStationController.editEvStationView
// );

// router.post(
//   "/:uuid",
//   upload.none(),
//   auth({ permission: "edit_ev_station" }),
//   evStationController.updateEvStation
// );
module.exports = router;
