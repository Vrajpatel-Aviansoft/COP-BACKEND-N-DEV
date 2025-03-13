const express = require("express");
const router = express.Router();
const { carModelController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");
const { carModelValidation } = require("../../validations");

// <-------------------------------- import module ----------------------------------------->

// <--------------------------------Non EV Launched import module Start ----------------------------------------->

router.get(
  "/import/non-ev/launched",
  auth({ permission: "create_model" }),
  carModelController.carModelNonEvLaunchedImportView
);

router.post(
  "/import/non-ev/launched",
  auth({ permission: "create_model" }),
  upload.single("file"),
  carModelController.carModelNonEvLaunchedImport
);
// <-------------------------------- Non EV Launched import module end----------------------------------------->

// <-------------------------------- Non EV Upcoming import module Start ----------------------------------------->

router.get(
  "/import/non-ev/upcoming",
  auth({ permission: "create_model" }),
  carModelController.carModelNonEvUpcomingImportView
);

router.post(
  "/import/non-ev/upcoming",
  auth({ permission: "create_model" }),
  upload.single("file"),
  carModelController.carModelNonEvUpcomingImport
);

// <-------------------------------- Non EV Upcoming import module End ----------------------------------------->

// <-------------------------------- EV Launched import module Start ----------------------------------------->

router.get(
  "/import/ev/launched",
  auth({ permission: "create_model" }),
  carModelController.carModelEvLaunchedImportView
);

router.post(
  "/import/ev/launched",
  auth({ permission: "create_model" }),
  upload.single("file"),
  carModelController.carModelEvLaunchedImport
);

// <--------------------------------EV Launched import module End ----------------------------------------->

// <-------------------------------- EV Upcoming import module Start ----------------------------------------->

router.get(
  "/import/ev/upcoming",
  auth({ permission: "create_model" }),
  carModelController.carModelEvUpcomingImportView
);

router.post(
  "/import/ev/upcoming",
  auth({ permission: "create_model" }),
  upload.single("file"),
  carModelController.carModelEvUpcomingImport
);

// <--------------------------------EV  Upcoming import module End ----------------------------------------->

// <-------------------------------- import module ----------------------------------------->

router.get(
  "/",
  auth({ permission: "view_model" }),
  carModelController.carModelView
);
router.get(
  "/create",
  auth({ permission: "create_model" }),
  carModelController.carModelCreateView
);
router.get("/all", carModelController.getCarModels);
router.post(
  "/create",
  auth({ isView: false, permission: "create_model" }),
  validate(carModelValidation.createCarModel),
  upload.fields([
    { name: "model_image", maxCount: 1 },
    { name: "model_image_mob", maxCount: 1 },
  ]),
  carModelController.createCarModel
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_model" }),
  carModelController.toggleCarModelStatus
);
router.delete(
  "/:uuid",
  auth({ isView: false, permission: "delete_model" }),
  carModelController.deleteCarModel
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_model" }),
  carModelController.editCarModelView
);
router.post(
  "/:uuid",
  auth({ isView: false, permission: "edit_model" }),
  validate(carModelValidation.updateCarModel),
  upload.fields([
    { name: "model_image", maxCount: 1 },
    { name: "model_image_mob", maxCount: 1 },
  ]),
  carModelController.updateCarModel
);
module.exports = router;
