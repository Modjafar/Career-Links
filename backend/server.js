
/* eslint-env node */\n/* global process, require, module, console */\n\nconst express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
});
