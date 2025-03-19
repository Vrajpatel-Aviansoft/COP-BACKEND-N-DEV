const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { evStationController } = require("../../controllers");
const upload = require("../../middlewares/file");

// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import",
  auth({ permission: "" }),
  evStationController.evStationImportView
);
router.post(
  "/import",
  auth({ permission: "" }),
  upload.single("file")
  // fuelStationController.fuelStationImport
);
// <-------------------------------- import module ----------------------------------------->

router.get(
  "/",
  auth({ permission: "view_ev_station" }),
  evStationController.evStationView
);

router.get(
  "/create",
  auth({ permission: "create_ev_station" }),
  evStationController.evStationCreateView
);
router.get("/all", evStationController.getEvStations);

router.get("/city/:stateId/state", evStationController.getCitiesByState);

router.post(
  "/create",
  upload.none(),
  auth({ isView: false, permission: "create_ev_station" }),
  evStationController.createEvStation
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_ev_station" }),
  evStationController.toggleEvStationStatus
);
router.delete(
  "/:uuid",
  auth({ permission: "delete_ev_station" }),
  evStationController.deleteEvStation
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_ev_station" }),
  evStationController.editEvStationView
);

router.post(
  "/:uuid",
  upload.none(),
  auth({ permission: "edit_ev_station" }),
  evStationController.updateEvStation
);
module.exports = router;
