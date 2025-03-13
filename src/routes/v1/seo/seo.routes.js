const express = require("express");
const { seoController } = require("../../../controllers");
const { auth } = require("../../../middlewares/auth");
const upload = require("../../../middlewares/file");
const router = express.Router();

router.get("/", auth(), seoController.seoCreateView);
router.get(
  "/all",
  auth({ isView: false, permission: "view_seo" }),
  seoController.getSeoData
);

router.post(
  "/create",
  auth({ isView: false, permission: "create_seo" }),
  upload.none(),
  seoController.createSeo
);
router.get("/model/:uuid/brand", seoController.getModelsByBrand);
router.get("/variant/:uuid/model", seoController.getVariantsByModel);
router.get("/:uuid", seoController.getSeoDataByUuid);

router.delete("/:uuid", seoController.deleteSeo);
module.exports = router;
