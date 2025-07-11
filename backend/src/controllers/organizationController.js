const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Parser } = require("json2csv");

// Get all organizations (basic version)
exports.getOrganizations = async (req, res) => {
  const { search = "", industryId, status, page, limit } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const filters = {
    AND: [
      search ? { name: { contains: search, mode: "insensitive" } } : undefined,
      industryId ? { industryId: parseInt(industryId) } : undefined,
      status === "active"
        ? { isActive: true }
        : status === "inactive"
        ? { isActive: false }
        : undefined,
    ].filter(Boolean),
  };

  try {
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where: filters,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
        include: { industry: true },
      }),
      prisma.organization.count({ where: filters }),
    ]);

    res.json({
      data: organizations,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new organization
exports.createOrganization = async (req, res) => {
  const { name, industryId, website, taxId } = req.body;
  try {
    const newOrg = await prisma.organization.create({
      data: {
        name,
        industryId: parseInt(industryId),
        website,
        taxId,
      },
    });
    res.status(201).json(newOrg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update organization
exports.updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, industryId, website, taxId } = req.body;
  try {
    const updatedOrg = await prisma.organization.update({
      where: { id: parseInt(id) },
      data: { name, industryId: parseInt(industryId), website, taxId },
    });
    res.json(updatedOrg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle active/inactive
exports.toggleOrganizationStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const org = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const updatedOrg = await prisma.organization.update({
      where: { id: parseInt(id) },
      data: { isActive: !org.isActive },
    });
    res.json(updatedOrg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportOrganizationsCsv = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: { industry: true },
    });

    const fields = [
      "id",
      "name",
      "industry.name",
      "website",
      "taxId",
      "isActive",
    ];
    const data = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      industry: org.industry?.name || "",
      website: org.website,
      taxId: org.taxId,
      isActive: org.isActive ? "Active" : "Inactive",
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("organizations.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrganizationById = async (req, res) => {
  const { id } = req.params;
  try {
    const org = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });
    if (!org) return res.status(404).json({ error: "Organization not found" });

    res.json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleOrganizationStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const org = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });
    if (!org) return res.status(404).json({ error: "Organization not found" });

    const updatedOrg = await prisma.organization.update({
      where: { id: parseInt(id) },
      data: { isActive: !org.isActive },
    });

    res.json(updatedOrg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
