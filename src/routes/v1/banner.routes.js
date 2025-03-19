const express = require("express");
const { bannerController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const upload = require("../../middlewares/file");

router.get("/create", auth(), bannerController.bannerCreateView);
router.get(
  "/all",
  auth({ isView: false, permission: "view_banner" }),
  bannerController.getBanners
);
router.get(
  "/",
  auth({ permission: "view_banner" }),
  bannerController.bannerView
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_banner" }),
  bannerController.editBannerView
);
router.get("/model/:brandId/brand", bannerController.getModelsByBrand);

router.post(
  "/create",
  auth({ isView: false, permission: "create_banner" }),
  // validate(brandValidation.createBrand),
  upload.any(),
  bannerController.createBanner
);

router.put(
  "/:uuid",
  auth({ permission: "edit_banner" }),
  upload.any(),
  bannerController.updateBanner
);

router.patch(
  "/:uuid/status",
  auth({ permission: "edit_banner" }),
  bannerController.toggleStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "delete_banner" }),
  bannerController.deleteBanner
);

module.exports = router;
