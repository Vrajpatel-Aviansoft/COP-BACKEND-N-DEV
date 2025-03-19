const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { dealerShipController } = require("../../controllers");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");
const { dealershipValidation } = require("../../validations");

// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import",
  auth({ permission: "" }),
  dealerShipController.dealerShipImportView
);

router.post(
  "/import",
  auth({ permission: "" }),
  upload.single("file"),
  dealerShipController.dealerShipImport
);

// <-------------------------------- import module ----------------------------------------->

router.get("/", auth({ permission: "" }), dealerShipController.dealerShipView);
router.get(
  "/create",
  auth({ permission: "" }),
  dealerShipController.dealerShipCreateView
);

router.get("/all", dealerShipController.getDealerShip);

router.get("/city/:stateId/state", dealerShipController.getCitiesByState);
router.post(
  "/create",
  upload.none(),
  auth({ isView: false, permission: "" }),
  validate(dealershipValidation.createDealerShip),
  dealerShipController.createDealerShip
);

router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "" }),
  dealerShipController.toggleDealerShipStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "" }),
  dealerShipController.deleteDealerShip
);

router.get(
  "/:uuid/edit",
  auth({ permission: "" }),
  dealerShipController.editDealerShipView
);

router.post(
  "/:uuid",
  upload.none(),
  auth({ permission: "" }),
  dealerShipController.updateDealerShip
);
module.exports = router;
