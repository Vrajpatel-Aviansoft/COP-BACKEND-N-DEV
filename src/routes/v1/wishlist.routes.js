const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { wishlistController } = require("../../controllers");

router.get("/", auth({ permission: "" }), wishlistController.wishlistView);

router.get("/all", auth({ permission: "" }), wishlistController.getWishlist);

module.exports = router;
