/* eslint-env node */
/* global require, module, console, process */

const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log("Registration attempt:", { name, email, role });

        if (!name || !email || !password || !role) {
            console.log("Missing required fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        console.log("User registered successfully:", email);
        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt:", { email });

        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password for:", email);
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        console.log("Login successful for:", email);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Internships
router.get("/internships", (req, res) => {
    const type = req.query.type; // paid / unpaid

    const internships = {
        paid: [
            { title: "Google Internship", company: "Google" },
            { title: "Microsoft Internship", company: "Microsoft" }
        ],
        unpaid: [
            { title: "Startup Internship", company: "Local Startup" }
        ]
    };

    res.json(internships[type] || []);
});

// Courses
router.get("/courses", (req, res) => {
    const type = req.query.type;

    const courses = {
        paid: [
            { title: "Full Stack Course", platform: "Udemy" }
        ],
        unpaid: [
            { title: "HTML & CSS", platform: "FreeCodeCamp" }
        ]
    };

    res.json(courses[type] || []);
});

// Jobs
router.get("/jobs", (req, res) => {
    res.json([
        { title: "Frontend Developer", company: "Amazon" },
        { title: "Backend Developer", company: "Infosys" }
    ]);
});

// Profile - Protected route
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.json({
            success: true,
            message: "Protected profile data",
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({ success: true, message: "Career Links API is running!", timestamp: new Date().toISOString() });
});

module.exports = router;

