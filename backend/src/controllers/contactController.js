const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Parser } = require("json2csv");

exports.exportContactsCsv = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: { organization: true },
    });

    const fields = [
      "id",
      "firstName",
      "lastName",
      "jobTitle",
      "email",
      "organization.name",
      "isPrimaryContact",
      "isActive",
    ];
    const data = contacts.map((contact) => ({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      jobTitle: contact.jobTitle,
      email: contact.email,
      organization: contact.organization?.name || "",
      isPrimaryContact: contact.isPrimaryContact ? "Yes" : "No",
      isActive: contact.isActive ? "Active" : "Inactive",
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("contacts.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all contacts for an organization
exports.getContactsForOrganization = async (req, res) => {
  const { orgId } = req.params;
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        organizationId: parseInt(orgId),
        isActive: true,
      },
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new contact
exports.createContact = async (req, res) => {
  const { orgId } = req.params;
  const {
    firstName,
    lastName,
    jobTitle,
    department,
    email,
    phone,
    mobileNumber,
    isPrimaryContact,
  } = req.body;

  try {
    if (isPrimaryContact) {
      await prisma.contact.updateMany({
        where: {
          organizationId: parseInt(orgId),
          isPrimaryContact: true,
        },
        data: { isPrimaryContact: false },
      });
    }

    const newContact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        jobTitle,
        department,
        email,
        officePhoneNumber: phone,
        mobilePhoneNumber: mobileNumber,
        organizationId: parseInt(orgId), // ✅ Set correctly
        isPrimaryContact: !!isPrimaryContact,
      },
    });

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    jobTitle,
    department,
    email,
    phone,
    mobileNumber,
    isPrimaryContact,
  } = req.body;
  try {
    // If setting to primary, clear the old one
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
    });
    if (!contact) return res.status(404).json({ error: "Contact not found" });

    if (isPrimaryContact) {
      await prisma.contact.updateMany({
        where: {
          organizationId: contact.organizationId,
          isPrimaryContact: true,
        },
        data: { isPrimaryContact: false },
      });
    }

    const updated = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        jobTitle,
        department,
        email,
        officePhoneNumber: phone,
        mobilePhoneNumber: mobileNumber,
        isPrimaryContact: !!isPrimaryContact,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle active/inactive status
exports.toggleContactStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
    });
    if (!contact) return res.status(404).json({ error: "Contact not found" });

    const updated = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: { isActive: !contact.isActive },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContactById = (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};

// Get all contacts (optionally filter by active status)
exports.getAllContacts = async (req, res) => {
  const { isActive } = req.query;

  const filters = {};
  if (isActive === "true") {
    filters.isActive = true;
  } else if (isActive === "false") {
    filters.isActive = false;
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: { organization: true }, // Optional: include organization details
    });

    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
