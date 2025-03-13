const express = require("express");
const { carTypeController } = require("../../../controllers");
const router = express.Router();

router.get("/", carTypeController.carTypeView);
router.get("/create", carTypeController.carTypeCreateView);
router.get("/all", carTypeController.getCarTypes);
router.post("/", carTypeController.createCarType);
router.delete("/:uuid", carTypeController.deleteCarType);
router.get("/:uuid/edit", carTypeController.editCarTypeView);
router.put("/:uuid", carTypeController.editCarType);

// router.post("/", carTypeController.createCarType);
router.get("/", carTypeController.carTypeView);
module.exports = router;
