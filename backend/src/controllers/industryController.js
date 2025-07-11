const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all industries
exports.getAllIndustries = async (req, res) => {
  try {
    const industries = await prisma.industry.findMany();
    res.json(industries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new industry (optional, for admin panel)
exports.createIndustry = async (req, res) => {
  const { name } = req.body;
  try {
    const industry = await prisma.industry.create({
      data: { name },
    });
    res.status(201).json(industry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an industry (optional)
exports.updateIndustry = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const industry = await prisma.industry.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(industry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
