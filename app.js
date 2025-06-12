const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authenticatRoutes = require("./routes/authenticat");
const meRoutes = require("./routes/me");
const adsRoutes = require("./routes/ads");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/authenticat", authenticatRoutes);
app.use("/api/me", meRoutes);
app.use("/api/ads", adsRoutes);

// Start server
const PORT = process.env.L_PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
