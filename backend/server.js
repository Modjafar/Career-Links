/* eslint-env node */
/* global process, require, module, console */

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectDB = require("./config/db");
require("dotenv").config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "SMTP_USER", "SMTP_PASS"];
const missingEnvVars = requiredEnvVars.filter(name => !process.env[name]);
if (missingEnvVars.length) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5
});

// Middleware
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Connect DB
connectDB();

// Routes - auth + public APIs (rate limited)
app.use('/api', authLimiter, require("./routes/api"));

// Health check (public)
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API Healthy' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

