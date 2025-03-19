const express = require("express");
const router = express.Router();
const { featureValueController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/file");

// <-------------------------------- Feature value import module Start ----------------------------------------->

router.get(
  "/import",
  auth({ permission: "create_feature_value" }),
  featureValueController.featureValueImportView
);

router.post(
  "/import",
  auth({ permission: "create_feature_value" }),
  upload.single("file"),
  featureValueController.featureValueImport
);

// <-------------------------------- Feature value import module End ----------------------------------------->

router.get(
  "/create",
  auth({ permission: "create_feature" }),
  featureValueController.featureValueCreateView
);

router.get("/model/:uuid/brand", featureValueController.getModelsByBrand);
router.get("/variant/:uuid/model", featureValueController.getVariantsByModel);
router.post("/feature/:uuid/spec", featureValueController.getFeaturesBySpecs);

router.post(
  "/create",
  upload.none(),
  auth({ isView: false, permission: "create_feature_value" }),
  featureValueController.createFeatureValue
);

module.exports = router;
