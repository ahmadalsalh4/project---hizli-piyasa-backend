const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authenticatRoutes = require('./routes/authenticat');
const meRoutes = require('./routes/me');
const adsRoutes = require('./routes/ads');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

//http://localhost:5000/ads?category=electronics&city=New+York&minPrice=100&maxPrice=1000
// &startDate=2023-01-01&search=laptop&sortBy=price&sortOrder=ASC

// patch user ad

// Routes
app.use('/authenticat', authenticatRoutes);
app.use('/me', meRoutes);
app.use('/ads', adsRoutes);

// Start server
const PORT = process.env.L_PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));