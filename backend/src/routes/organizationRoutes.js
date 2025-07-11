// src/routes/organizationRoutes.js
const express = require("express");
const router = express.Router();

const organizationController = require("../controllers/organizationController");
const contactController = require("../controllers/contactController");

// Organization routes
router.get("/", organizationController.getOrganizations);
router.get("/:id", organizationController.getOrganizationById);
router.post("/", organizationController.createOrganization);
router.put("/:id", organizationController.updateOrganization);
router.patch("/:id/toggle", organizationController.toggleOrganizationStatus);
router.get("/export/csv", organizationController.exportOrganizationsCsv);

// Nested Contact routes (under an organization)
router.get("/:orgId/contacts", contactController.getContactsForOrganization);
router.get("/:orgId/contacts/:contactId", contactController.getContactById);
router.post("/:orgId/contacts", contactController.createContact);

module.exports = router;
