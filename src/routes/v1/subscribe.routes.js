const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { subscribeController } = require("../../controllers");

router.get("/", auth({ permission: "" }), subscribeController.subscribeView);

router.get("/all", auth({ permission: "" }), subscribeController.getSubscribe);

router.delete(
  "/:uuid",
  auth({ permission: "" }),
  subscribeController.deleteSubscribe
);

module.exports = router;
