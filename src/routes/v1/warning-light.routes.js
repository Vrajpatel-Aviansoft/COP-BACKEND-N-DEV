const express = require("express");
const { warningLightController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const upload = require("../../middlewares/file");

router.get("/create", auth(), warningLightController.warningLightCreateView);
router.get(
  "/all",
  auth({ isView: false, permission: "view_car_warning_light" }),
  warningLightController.getWarningLights
);
router.get(
  "/",
  auth({ permission: "view_car_warning_light" }),
  warningLightController.warningLightView
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_car_warning_light" }),
  warningLightController.editWarningLightView
);

router.post(
  "/create",
  auth({ isView: false, permission: "create_car_warning_light" }),
  // validate(brandValidation.createBrand),
  upload.any(),
  warningLightController.createWarningLight
);

router.put(
  "/:uuid",
  auth({ permission: "edit_car_warning_light" }),
  upload.any(),
  warningLightController.updateWarningLight
);

router.patch(
  "/:uuid/status",
  auth({ permission: "edit_car_warning_light" }),
  warningLightController.toggleStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "delete_car_warning_light" }),
  warningLightController.deleteWarningLight
);

module.exports = router;
