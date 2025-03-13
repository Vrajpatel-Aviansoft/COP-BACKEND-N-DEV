const express = require("express");
const { carStageController } = require("../../../controllers");
const router = express.Router();

router.get("/", carStageController.carStageView);
router.get("/create", carStageController.carStageCreateView);
router.get("/all", carStageController.getCarStages);
router.post("/", carStageController.createCarStage);
router.delete("/:uuid", carStageController.deleteCarStage);
router.get("/:uuid/edit", carStageController.editCarStageView);
router.put("/:uuid", carStageController.editCarStage);

module.exports = router;
