const express = require("express");
const router = express.Router();
const { roleController } = require("../../controllers");
const { auth } = require("../../middlewares/auth");
const upload = require("../../middlewares/file");
const validate = require("../../middlewares/validate");
const { roleValidation } = require("../../validations");

router.get("/", auth({ permission: "" }), roleController.roleView);
router.get("/create", auth({ permission: "" }), roleController.roleCreateView);
router.get("/all", roleController.getRoles);
router.post(
  "/create",
  upload.none(),
  auth({ isView: false, permission: "" }),
  validate(roleValidation.createRole),
  roleController.createRole
);
router.delete(
  "/:uuid",
  auth({ isView: false, permission: "" }),
  roleController.deleteRole
);
router.get(
  "/:uuid/edit",
  auth({ permission: "" }),
  roleController.editRoleView
);
router.put(
  "/:uuid",
  auth({ isView: false, permission: "" }),
  validate(roleValidation.updateRole),
  roleController.updateRole
);
module.exports = router;
