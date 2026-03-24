/* eslint-env node */
/* global process, require, module, console */

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

