// src/routes/contactRoutes.js
const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

// Contact routes (not nested under organizations)
router.get("/", contactController.getAllContacts);
router.get("/export/csv", contactController.exportContactsCsv);
router.get("/:id", contactController.getContactById);
router.put("/:id", contactController.updateContact);
router.patch("/:id/toggle-status", contactController.toggleContactStatus);

module.exports = router;
