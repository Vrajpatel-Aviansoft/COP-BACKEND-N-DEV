const express = require("express");
const router = express.Router();
const { featureController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");

router.get(
  "/",
  auth({ permission: "view_feature" }),
  featureController.faetureView
);
router.get(
  "/create",
  auth({ permission: "create_feature" }),
  featureController.featureCreateView
);
router.get("/all", featureController.getFeatures);

router.post(
  "/create",
  auth({ isView: false, permission: "create_feature" }),
  upload.fields([{ name: "features_image", maxCount: 1 }]),
  featureController.createFeature
);

router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_feature" }),
  featureController.toggleFeatureStatus
);

router.delete(
  "/:uuid",
  auth({ isView: false, permission: "delete_feature" }),
  featureController.deleteFeature
);

router.get(
  "/:uuid/edit",
  auth({ permission: "edit_feature" }),
  featureController.editFeatureView
);

router.put(
  "/:uuid",
  auth({ isView: false, permission: "edit_feature" }),
  upload.fields([{ name: "features_image", maxCount: 1 }]),
  featureController.updateFeature
);
module.exports = router;
