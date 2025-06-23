const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/authenticat", require("./routes/authenticat"));
app.use("/api/me", require("./routes/me"));
app.use("/api/ads", require("./routes/ads"));

const PORT = process.env.L_PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
