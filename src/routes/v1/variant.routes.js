const express = require("express");
const { variantController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const upload = require("../../middlewares/file");

// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import",
  auth({ permission: "" }),
  variantController.variantImportView
);
router.get(
  "/import/color",
  auth({ permission: "" }),
  variantController.variantColorImportView
);
router.post(
  "/import",
  auth({ permission: "" }),
  upload.single("file"),
  variantController.variantImport
);
router.post(
  "/import/color",
  auth({ permission: "" }),
  upload.single("file"),
  variantController.variantColorImport
);

// <-------------------------------- import module ----------------------------------------->

router.get("/create", auth(), variantController.variantCreateView);
router.get(
  "/all",
  auth({ isView: false, permission: "view_variant" }),
  variantController.getVariants
);
router.get(
  "/",
  auth({ permission: "view_variant" }),
  variantController.variantView
);
router.get(
  "/model/:modelId/variant",
  auth({ permission: "view_variant" }),
  variantController.getVariantsByModel
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_variant" }),
  variantController.editVariantView
);
router.get("/model/:brandId/brand", variantController.getModelsByBrand);

router.post(
  "/create",
  auth({ isView: false, permission: "create_variant" }),
  // validate(brandValidation.createBrand),
  upload.any(),
  variantController.createVariant
);

router.put(
  "/:uuid",
  auth({ permission: "edit_variant" }),
  upload.any(),
  variantController.updateVariant
);

router.patch(
  "/:uuid/status",
  auth({ permission: "edit_variant" }),
  variantController.toggleStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "delete_variant" }),
  variantController.deleteVariant
);

module.exports = router;
