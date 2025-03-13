const express = require("express");
const router = express.Router();
const { auth } = require("../../../middlewares/auth");
const { pageController } = require("../../../controllers");
const upload = require("../../../middlewares/file");

router.get("/", auth({ permission: "view_meta_tag" }), pageController.PageView);

router.get(
  "/create",
  auth({ permission: "create_meta_tag" }),
  pageController.PageCreateView
);
router.get("/all", pageController.getPage);

router.post(
  "/create",
  auth({ isView: false, permission: "create_meta_tag" }),
  upload.none(),
  pageController.createPage
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_meta_tag" }),
  pageController.togglePageStatus
);
router.delete(
  "/:uuid",
  auth({ permission: "delete_meta_tag" }),
  pageController.deletePage
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_meta_tag" }),
  pageController.editPageView
);

router.post(
  "/:uuid",
  auth({ permission: "edit_meta_tag" }),
  upload.none(),
  pageController.updatePage
);
module.exports = router;
