const express = require("express");
const router = express.Router();
const { auth } = require("../../../middlewares/auth");
const { metaTagController } = require("../../../controllers");
const upload = require("../../../middlewares/file");

router.get(
  "/",
  auth({ permission: "view_meta_tag" }),
  metaTagController.TagView
);

router.get(
  "/create",
  auth({ permission: "create_meta_tag" }),
  metaTagController.TagCreateView
);
router.get("/all", metaTagController.getTags);

router.post(
  "/create",
  auth({ isView: false, permission: "create_meta_tag" }),
  upload.none(),
  metaTagController.createTag
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_meta_tag" }),
  metaTagController.toggleTagStatus
);
router.delete(
  "/:uuid",
  auth({ permission: "delete_meta_tag" }),
  metaTagController.deleteTag
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_meta_tag" }),
  metaTagController.editTagView
);

router.post(
  "/:uuid",
  auth({ permission: "edit_meta_tag" }),
  upload.none(),
  metaTagController.updateTag
);
module.exports = router;
