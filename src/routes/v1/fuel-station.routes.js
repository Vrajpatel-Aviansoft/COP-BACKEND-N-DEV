const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { fuelStationController } = require("../../controllers");
const upload = require("../../middlewares/file");

// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import",
  auth({ permission: "" }),
  fuelStationController.fuelStationImportView
);
router.post(
  "/import",
  auth({ permission: "" }),
  upload.single("file"),
  fuelStationController.fuelStationImport
);
// <-------------------------------- import module ----------------------------------------->

router.get(
  "/",
  auth({ permission: "view_fuel_station" }),
  fuelStationController.fuelStationView
);

router.get(
  "/create",
  auth({ permission: "create_fuel_station" }),
  fuelStationController.fuelStationCreateView
);
router.get("/all", fuelStationController.getFuelStations);

router.get("/city/:stateId/state", fuelStationController.getCitiesByState);

router.post(
  "/create",
  upload.none(),
  auth({ isView: false, permission: "create_fuel_station" }),
  fuelStationController.createFuelStation
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_fuel_station" }),
  fuelStationController.toggleFuelStationStatus
);
router.delete(
  "/:uuid",
  auth({ permission: "delete_fuel_station" }),
  fuelStationController.deleteFuelStation
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_fuel_station" }),
  fuelStationController.editFuelStationView
);

router.post(
  "/:uuid",
  upload.none(),
  auth({ permission: "edit_fuel_station" }),
  fuelStationController.updateFuelStation
);
module.exports = router;
