const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { specificationCotroller } = require("../../controllers");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");

router.get(
  "/",
  auth({ permission: "view_specification" }),
  specificationCotroller.specificationView
);

router.get(
  "/create",
  auth({ permission: "create_specification" }),
  specificationCotroller.specificationCreateView
);
router.get("/all", specificationCotroller.getSpecs);

router.post(
  "/create",
  auth({ isView: false, permission: "create_specification" }),
  upload.fields([{ name: "spec_image", maxCount: 1 }]),
  specificationCotroller.createSpecification
);
router.patch(
  "/:uuid/status",
  auth({ isView: false, permission: "edit_specification" }),
  specificationCotroller.toggleSpecificationStatus
);
router.delete(
  "/:uuid",
  auth({ permission: "delete_specification" }),
  specificationCotroller.deleteSpecification
);
router.get(
  "/:uuid/edit",
  auth({ permission: "edit_specification" }),
  specificationCotroller.editSpecificationView
);

router.post(
  "/:uuid",
  auth({ permission: "edit_specification" }),
  upload.fields([{ name: "spec_image", maxCount: 1 }]),
  specificationCotroller.updateSpecification
);
module.exports = router;
