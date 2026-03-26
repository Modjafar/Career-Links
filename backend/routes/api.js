/* eslint-env node */
/* global require, module, console, process */

const express = require("express");
const User = require("../models/User.js");
const Opportunity = require("../models/Opportunity.js");
const SavedItem = require("../models/SavedItem.js");
const Analytics = require("../models/Analytics.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

// Nodemailer transporter (configure .env with SMTP_USER, SMTP_PASS)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Register (enhanced with email later)
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
        res.json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login (unchanged)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login attempt:", { email });

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

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

// Dynamic Opportunities APIs
// GET /api/internships?paid=true&domain=IT
router.get("/internships", async (req, res) => {
    try {
        const { domain } = req.query;
        const paid = req.query.paid === 'true';
        const query = { type: 'internship', paid };
        if (domain) query.domain = domain;
        let data = await Opportunity.find(query).lean().limit(20);
        if (data.length === 0) data = await seedMockOpportunities('internship', paid, domain);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/jobs?domain=IT
router.get("/jobs", async (req, res) => {
    try {
        const { domain } = req.query;
        const query = { type: 'job' };
        if (domain) query.domain = domain;
        let data = await Opportunity.find(query).lean().limit(20);
        if (data.length === 0) data = await seedMockOpportunities('job', true, domain);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/courses?paid=true&domain=IT
router.get("/courses", async (req, res) => {
    try {
        const { domain } = req.query;
        const paid = req.query.paid === 'true';
        const query = { type: 'course', paid };
        if (domain) query.domain = domain;
        let data = await Opportunity.find(query).lean().limit(20);
        if (data.length === 0) data = await seedMockOpportunities('course', paid, domain);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/search?q=dev&domain=IT&type=internship&paid=true&location=
router.get("/search", async (req, res) => {
    try {
        const { q, domain, type, paid, location } = req.query;
        const paidBool = paid === 'true';
        const query = {};
        if (q) query.$or = [{ title: { $regex: q, $options: 'i' } }, { company: { $regex: q, $options: 'i' } }];
        if (domain) query.domain = domain;
        if (type) query.type = type;
        if (paid !== undefined) query.paid = paidBool;
        if (location) query.location = { $regex: location, $options: 'i' };
        const results = await Opportunity.find(query).lean().limit(50);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected Saved Items
// GET /api/saved
router.get("/saved", authMiddleware, async (req, res) => {
    try {
        const saved = await SavedItem.find({ userId: req.user.userId }).populate('opportunityId').lean();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/save
router.post("/save", authMiddleware, async (req, res) => {
    try {
        const { opportunityId, item } = req.body;
        const existing = await SavedItem.findOne({ userId: req.user.userId, opportunityId });
        if (existing) return res.json({ message: 'Already saved' });
        const savedItem = new SavedItem({ userId: req.user.userId, opportunityId, item });
        await savedItem.save();
        res.json({ message: 'Saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/track
router.post("/track", async (req, res) => {
    try {
        const { page, action, domain, itemTitle, userId } = req.body;
        const track = new Analytics({ userId, page, action, domain, itemTitle });
        await track.save();
        res.json({ message: 'Tracked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/send-email
router.post("/send-email", async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send email. Check SMTP config.' });
    }
});

// Profile
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

// Seed sample data
router.post("/seed", authMiddleware, async (req, res) => {
    try {
        await seedMockOpportunities('internship', true, 'IT');
        await seedMockOpportunities('internship', false, 'Finance');
        await seedMockOpportunities('job', true, 'IT');
        await seedMockOpportunities('course', true, 'Management');
        await seedMockOpportunities('course', false, 'English');
        res.json({ message: 'Sample data seeded' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health
router.get("/health", (req, res) => {
    res.json({ success: true, message: "Career Links API Enhanced!", timestamp: new Date().toISOString() });
});

// Seed mock data function (internal)
async function seedMockOpportunities(type, paid, domain) {
    const mockData = [
        { type, title: 'Google ' + type, company: 'Google', domain: domain || 'IT', paid, location: 'Remote' },
        { type, title: 'Microsoft ' + type, company: 'Microsoft', domain: domain || 'IT', paid, location: 'Bangalore' },
        { type, title: 'Amazon ' + type, company: 'Amazon', domain: domain || 'IT', paid, location: 'Hyderabad' },
        { type, title: 'Startup ' + type, company: 'Local Startup', domain: domain || 'Management', paid: false, location: 'Local' }
    ];
    const opps = await Opportunity.insertMany(mockData);
    return opps;
}

module.exports = router;

