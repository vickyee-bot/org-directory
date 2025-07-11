const seedIndustries = require("./seedIndustries");
const seedOrganizations = require("./seedOrganizations");
const seedContacts = require("./seedContacts");

async function main() {
  await seedIndustries();
  await seedOrganizations();
  await seedContacts();
}

main()
  .then(() => console.log("🌱 Seeding complete"))
  .catch(console.error)
  .finally(() => process.exit());
