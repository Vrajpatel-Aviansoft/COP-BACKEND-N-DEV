const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { serviceStationController } = require("../../controllers");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");


// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import",
  auth({ permission: "" }),
  serviceStationController.serviceStationImportView
);

router.post(
  "/import",
  auth({ permission: "" }),
  upload.single("file"),
  serviceStationController.serviceStationImport
);

// <-------------------------------- import module ----------------------------------------->

router.get(
  "/",
  auth({ permission: "view_service_station" }),
  serviceStationController.serviceStationView
);

router.get(
  "/create",
  auth({ permission: "create_service_station" }),
  serviceStationController.serviceStationCreateView
);
router.get("/all", serviceStationController.getServiceStations);

router.get("/city/:stateId/state", serviceStationController.getCitiesByState);

router.post(
  "/create",
  upload.none(),
  auth({ isView: false, permission: "create_service_station" }),
  serviceStationController.createServiceStation
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_service_station" }),
  serviceStationController.toggleServiceStationStatus
);
router.delete(
  "/:uuid",
  auth({ permission: "delete_service_station" }),
  serviceStationController.deleteServiceStation
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_service_station" }),
  serviceStationController.editServiceStationView
);

router.post(
  "/:uuid",
  upload.none(),
  auth({ permission: "edit_service_station" }),
  serviceStationController.updateServiceStation
);
module.exports = router;
