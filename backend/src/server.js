const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const organizationRoutes = require("./routes/organizationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const industryRoutes = require("./routes/industryRoutes");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
app.use("/organizations", organizationRoutes);
app.use("/contacts", contactRoutes);
app.use("/industries", industryRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
