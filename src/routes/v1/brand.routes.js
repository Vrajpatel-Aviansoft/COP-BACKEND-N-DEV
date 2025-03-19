const express = require("express");
const router = express.Router();
const { brandController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");
const { brandValidation } = require("../../validations");

// <-------------------------------- import module ----------------------------------------->
router.get(
  "/import",
  auth({ permission: "" }),
  brandController.brandImportView
);
router.post(
  "/import",
  auth({ permission: "" }),
  upload.single("file"),
  brandController.brandImport
);

// <-------------------------------- import module ----------------------------------------->

router.get("/", auth({ permission: "" }), brandController.brandView);
router.get(
  "/create",
  auth({ permission: "" }),
  brandController.brandCreateView
);
router.get("/all", brandController.getBrands);
router.post(
  "/create",
  auth({ isView: false, permission: "" }),
  validate(brandValidation.createBrand),
  upload.fields([
    { name: "brand_logo", maxCount: 1 },
    { name: "brand_banner", maxCount: 1 },
  ]),
  brandController.createBrand
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "" }),
  brandController.toggleBrandStatus
);
router.delete(
  "/:uuid",
  auth({ isView: false, permission: "" }),
  brandController.deleteBrand
);
router.get(
  "/:uuid/edit",
  auth({ permission: "" }),
  brandController.editBrandView
);
router.put(
  "/:uuid",
  auth({ isView: false, permission: "" }),
  validate(brandValidation.updateBrand),
  upload.fields([
    { name: "brand_logo", maxCount: 1 },
    { name: "brand_banner", maxCount: 1 },
  ]),
  brandController.updateBrand
);
module.exports = router;
