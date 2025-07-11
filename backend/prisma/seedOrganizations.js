const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seedOrganizations() {
  const industries = await prisma.industry.findMany();

  for (let i = 0; i < 20; i++) {
    const randomIndustry =
      industries[Math.floor(Math.random() * industries.length)];

    await prisma.organization.create({
      data: {
        name: faker.company.name(),
        website: faker.internet.url(),
        taxId: faker.string.alphanumeric(8),
        industryId: randomIndustry.id,
        isActive: true,
      },
    });
  }

  console.log("✅ Organizations seeded");
}

module.exports = seedOrganizations;
