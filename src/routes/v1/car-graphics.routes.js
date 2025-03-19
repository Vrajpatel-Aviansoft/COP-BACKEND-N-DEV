const express = require("express");
const { carGraphicsController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const upload = require("../../middlewares/file");

// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import/image",
  auth({ permission: "" }),
  carGraphicsController.carGraphicsImageImportView
);

router.get(
  "/import/video",
  auth({ permission: "" }),
  carGraphicsController.carGraphicsVideoImportView
);

router.post(
  "/import/image",
  auth({ permission: "" }),
  upload.single("file"),
  carGraphicsController.carGraphicsImageImport
);

router.post(
  "/import/video",
  auth({ permission: "" }),
  upload.single("file"),
  carGraphicsController.carGraphicsVideosImport
);

// <-------------------------------- import module ----------------------------------------->

router.get("/create", auth(), carGraphicsController.carGraphicsCreateView);
router.get(
  "/all",
  auth({ isView: false, permission: "view_car_graphic" }),
  carGraphicsController.getCarGraphics
);
router.get(
  "/",
  auth({ permission: "view_car_graphic" }),
  carGraphicsController.carGraphicsView
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_car_graphic" }),
  carGraphicsController.editCarGraphicsView
);
router.get("/model/:brandId/brand", carGraphicsController.getModelsByBrand);

router.post(
  "/create",
  auth({ isView: false, permission: "create_car_graphic" }),
  // validate(brandValidation.createBrand),
  upload.any(),
  carGraphicsController.createCarGraphics
);

router.put(
  "/:uuid",
  auth({ permission: "edit_car_graphic" }),
  upload.any(),
  carGraphicsController.updateCarGraphics
);

router.patch(
  "/:uuid/status",
  auth({ permission: "edit_car_graphic" }),
  carGraphicsController.toggleStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "delete_car_graphic" }),
  carGraphicsController.deleteCarGraphics
);

module.exports = router;
