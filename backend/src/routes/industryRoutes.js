const express = require("express");
const router = express.Router();
const industryController = require("../controllers/industryController");

router.get("/", industryController.getAllIndustries);
router.post("/", industryController.createIndustry); // optional
router.put("/:id", industryController.updateIndustry); // optional

module.exports = router;
