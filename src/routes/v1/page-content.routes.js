const express = require("express");
const { pageContentController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const upload = require("../../middlewares/file");

router.get("/create", auth(), pageContentController.pageContentCreateView);
router.get(
  "/all",
  auth({ isView: false, permission: "view_page_content" }),
  pageContentController.getPageContents
);
router.get(
  "/",
  auth({ permission: "view_page_content" }),
  pageContentController.pageContentView
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_page_content" }),
  pageContentController.editPageContentView
);

router.post(
  "/create",
  auth({ isView: false, permission: "create_page_content" }),
  // validate(brandValidation.createBrand),
  upload.none(),
  pageContentController.createPageContent
);

router.put(
  "/:uuid",
  auth({ permission: "edit_page_content" }),
  upload.any(),
  pageContentController.updatePageContent
);

router.patch(
  "/:uuid/status",
  auth({ permission: "edit_page_content" }),
  pageContentController.toggleStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "delete_page_content" }),
  pageContentController.deletePageContent
);

module.exports = router;
