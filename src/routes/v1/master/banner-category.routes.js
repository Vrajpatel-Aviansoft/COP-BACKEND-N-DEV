const express = require("express");
const { bannerCategoryController } = require("../../../controllers");
const router = express.Router();

router.get("/view", bannerCategoryController.bannerCategoryview);
router.get("/all", bannerCategoryController.getBannerCategories);
router.get("/create", bannerCategoryController.bannerCategoryCreateView);
router.post("/", bannerCategoryController.createBannerCategory);
router.delete("/:id/destroy", bannerCategoryController.deleteBannerCategory);
router.get("/:uuid/edit", bannerCategoryController.editBannerCategoryView);
router.put("/:uuid/edit", bannerCategoryController.editBannerCategory);

module.exports = router;
