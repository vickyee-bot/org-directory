const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedIndustries() {
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
  ];

  await prisma.industry.createMany({
    data: industries.map((name) => ({ name })),
    skipDuplicates: true,
  });

  console.log("✅ Industries seeded");
}

module.exports = seedIndustries;
