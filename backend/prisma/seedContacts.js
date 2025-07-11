const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function seedContacts() {
  const organizations = await prisma.organization.findMany();

  for (const org of organizations) {
    const contactsToCreate = 5;

    for (let i = 0; i < contactsToCreate; i++) {
      await prisma.contact.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          jobTitle: faker.person.jobTitle(),
          department: faker.commerce.department(),
          email: faker.internet.email(),
          officePhoneNumber: faker.phone.number(),
          mobilePhoneNumber: faker.phone.number(),
          notes: faker.lorem.sentence(),
          isPrimaryContact: i === 0, // first one is primary
          isActive: true,
          organizationId: org.id,
        },
      });
    }
  }

  console.log("✅ Contacts seeded");
}

module.exports = seedContacts;
