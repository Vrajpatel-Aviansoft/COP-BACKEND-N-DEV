const express = require("express");
const router = express.Router();
const { auth } = require("../../../middlewares/auth");
const upload = require("../../../middlewares/file");
const validate = require("../../../middlewares/validate");
// const { dealershipValidation } = require("../../validations");
const { rtoController } = require("../../../controllers");

// router.get("/", rtoController.rtoView);
router.get("/", auth({ permission: "" }), rtoController.rtoView);

router.get("/create", auth({ permission: "" }), rtoController.rtoCreateView);

router.get("/all", rtoController.getRto);

router.post(
  "/create",
  upload.none(),
  auth({ isView: false, permission: "" }),
  // validate(dealershipValidation.createRto),
  rtoController.createRto
);

//   router.patch(
//     "/:uuid/status",
//     auth({ isView: false, permission: "" }),
//     rtoController.toggleDealerShipStatus
//   );

router.delete("/:uuid", auth({ permission: "" }), rtoController.deleteRto);

router.get("/:uuid/edit", auth({ permission: "" }), rtoController.editRtoView);

router.post(
  "/:uuid",
  upload.none(),
  auth({ permission: "" }),
  rtoController.updateRto
);
module.exports = router;
