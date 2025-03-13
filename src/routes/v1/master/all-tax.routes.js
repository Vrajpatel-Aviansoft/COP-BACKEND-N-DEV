const express = require("express");
const router = express.Router();
const { allTaxController } = require("../../../controllers");
const { auth } = require("../../../middlewares/auth");
const upload = require("../../../middlewares/file");

router.get(
  "/",
  auth({ permission: "view_all_tax" }),
  allTaxController.AllTaxView
);
router.get("/all", allTaxController.getAllTaxes);

router.get(
  "/create",
  auth({ permission: "create_all_tax" }),
  allTaxController.allTaxCreateView
);

router.post(
  "/create",
  upload.none(),
  auth({ permission: "create_all_tax" }),
  allTaxController.createAllTax
);

router.get(
  "/:uuid/edit",
  auth({ permission: "edit_all_tax" }),
  allTaxController.editAllTaxView
);

router.put(
  "/:uuid",
  upload.none(),
  auth({ permission: "edit_all_tax" }),
  allTaxController.updateAllTax
);

router.patch(
  "/:uuid/status",
  auth({ permission: "edit_all_tax" }),
  allTaxController.toggleAllTaxStatus
);

router.delete(
  "/:uuid",
  auth({ permission: "delete_all_tax" }),
  allTaxController.deleteAllTax
);
module.exports = router;
