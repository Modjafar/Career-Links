/* eslint-env node */
/* global process, require, module, console */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve frontend static

// Connect DB
connectDB();

// Routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

