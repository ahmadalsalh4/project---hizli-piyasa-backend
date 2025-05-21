const express = require('express');
const cors = require('cors');
require('dotenv').config();

const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const meRoutes = require('./routes/me');
//const adsRoutes = require('./routes/ads');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/me', meRoutes);
//app.use('/ads', adsRoutes);

// Start server
const PORT = process.env.L_PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
