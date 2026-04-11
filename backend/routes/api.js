/* eslint-env node */
/* global require, module, console, process */

const express = require("express");
const { body, query, validationResult } = require("express-validator");
const User = require("../models/User.js");
const Opportunity = require("../models/Opportunity.js");
const SavedItem = require("../models/SavedItem.js");
const Analytics = require("../models/Analytics.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').trim().isIn(['user', 'admin']).withMessage('Role must be user or admin')
];

const searchValidation = [
    query('q').optional().trim().escape(),
    query('domain').optional().trim().isIn(['IT', 'Finance', 'Management', 'Ecommerce', 'Government', 'English']).withMessage('Invalid domain'),
    query('type').optional().trim().isIn(['internship', 'job', 'course']).withMessage('Invalid type'),
    query('paid').optional().isIn(['true', 'false']).withMessage('Paid must be true or false'),
    query('location').optional().trim().escape()
];

function handleValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ success: false, message: firstError.msg });
    }
    return null;
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Nodemailer transporter (configure .env with SMTP_USER, SMTP_PASS)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Register with welcome email
router.post("/register", registerValidation, async (req, res) => {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    try {
        const { name, email, password, role } = req.body;

<<<<<<< HEAD
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
=======
        // Log removed for production

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
>>>>>>> eead07bad73863d49e11445f994623adb7ab7476
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

<<<<<<< HEAD
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to Career Links!',
            text: `Hi ${name},\n\nWelcome to Career Links! Start exploring internships, jobs, and courses.\n\nBest,\nCareer Links Team`
        };
        await transporter.sendMail(mailOptions);

        const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            data: {
                message: "User registered successfully",
                userId: user._id,
                token
            }
        });
=======
        // Send welcome email\n        const mailOptions = {\n            from: process.env.SMTP_USER,\n            to: email,\n            subject: `Welcome to Career Links, ${name}!`,\n            text: `Hi ${name},\\n\\nWelcome to Career Links! Start exploring internships, jobs, and courses.\\n\\nBest,\\nCareer Links Team`\n        };\n        transporter.sendMail(mailOptions).catch(console.error); // Fire-and-forget\n        \n        res.json({ message: "User registered successfully", userId: user._id });
>>>>>>> eead07bad73863d49e11445f994623adb7ab7476
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

<<<<<<< HEAD
=======
        // Log removed for production

>>>>>>> eead07bad73863d49e11445f994623adb7ab7476
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
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
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
        if (data.length === 0) {
            await seedMockOpportunities('internship', paid, domain);
            data = await Opportunity.find(query).lean().limit(20);
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/jobs?domain=IT
router.get("/jobs", async (req, res) => {
    try {
        const { domain } = req.query;
        const query = { type: 'job' };
        if (domain) query.domain = domain;

        let data = await Opportunity.find(query).lean().limit(20);
        if (data.length === 0) {
            await seedMockOpportunities('job', true, domain);
            data = await Opportunity.find(query).lean().limit(20);
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
        if (data.length === 0) {
            await seedMockOpportunities('course', paid, domain);
            data = await Opportunity.find(query).lean().limit(20);
        }

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/search?q=dev&domain=IT&type=internship&paid=true&location=
router.get("/search", searchValidation, async (req, res) => {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    try {
        const { q, domain, type, paid, location } = req.query;
        const paidBool = paid === 'true';
        const query = {};
        if (q) {
            const safeQ = escapeRegex(q);
            query.$or = [{ title: { $regex: safeQ, $options: 'i' } }, { company: { $regex: safeQ, $options: 'i' } }];
        }
        if (domain) query.domain = domain;
        if (type) query.type = type;
        if (paid !== undefined) query.paid = paidBool;
        if (location) {
            const safeLocation = escapeRegex(location);
            query.location = { $regex: safeLocation, $options: 'i' };
        }

        const results = await Opportunity.find(query).lean().limit(50);
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Protected Saved Items
// GET /api/saved
router.get("/saved", authMiddleware, async (req, res) => {
    try {
        const saved = await SavedItem.find({ userId: req.user.userId }).populate('opportunityId').lean();
        res.json({ success: true, data: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/save
router.post("/save", authMiddleware, async (req, res) => {
    try {
        const { opportunityId, item } = req.body;
        const existing = await SavedItem.findOne({ userId: req.user.userId, opportunityId });
        if (existing) return res.status(400).json({ success: false, message: 'Already saved' });

        const savedItem = new SavedItem({ userId: req.user.userId, opportunityId, item });
        await savedItem.save();
        res.json({ success: true, data: { message: 'Saved successfully' } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/saved/:id
router.delete("/saved/:id", authMiddleware, async (req, res) => {
    try {
        const savedItem = await SavedItem.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!savedItem) return res.status(404).json({ success: false, message: 'Saved item not found' });

        res.json({ success: true, data: { message: 'Unsaved successfully' } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/track
router.post("/track", async (req, res) => {
    try {
        const { page, action, domain, itemTitle, userId } = req.body;
        const track = new Analytics({ userId, page, action, domain, itemTitle });
        await track.save();
        res.json({ success: true, data: { message: 'Tracked' } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
        res.json({ success: true, data: { message: 'Email sent' } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send email. Check SMTP config.' });
    }
});

// Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

<<<<<<< HEAD
// Seed sample data (protected)
router.post("/seed", authMiddleware, async (req, res) => {
    try {
        await seedMockOpportunities('internship', true, 'IT');
        await seedMockOpportunities('internship', false, 'Finance');
        await seedMockOpportunities('job', true, 'IT');
        await seedMockOpportunities('course', true, 'Management');
        await seedMockOpportunities('course', false, 'English');
        res.json({ success: true, data: { message: 'Sample data seeded' } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
=======
// Public seed GET\nrouter.get("/seed", async (req, res) => {\n    try {\n        await seedMockOpportunities('internship', true, 'IT');\n        await seedMockOpportunities('internship', false, 'Finance');\n        await seedMockOpportunities('job', true, 'IT');\n        await seedMockOpportunities('course', true, 'Management');\n        await seedMockOpportunities('course', false, 'English');\n        res.json({ message: 'Sample data seeded (public)' });\n    } catch (error) {\n        res.status(500).json({ error: error.message });\n    }\n});\n\n// Auth protected seed (kept)\nrouter.post("/seed", authMiddleware, async (req, res) => {\n    try {\n        await seedMockOpportunities('internship', true, 'IT');\n        await seedMockOpportunities('internship', false, 'Finance');\n        await seedMockOpportunities('job', true, 'IT');\n        await seedMockOpportunities('course', true, 'Management');\n        await seedMockOpportunities('course', false, 'English');\n        res.json({ message: 'Sample data seeded' });\n    } catch (error) {\n        res.status(500).json({ error: error.message });\n    }\n});
>>>>>>> eead07bad73863d49e11445f994623adb7ab7476

// Health
router.get("/health", (req, res) => {
    res.json({ success: true, data: { message: "Career Links API Enhanced!", timestamp: new Date().toISOString() } });
});

// Seed mock data function (internal)
async function seedMockOpportunities(type, paid, domain) {
    const mockData = [
        { type, title: 'Google ' + type, company: 'Google', domain: domain || 'IT', paid, location: 'Remote' },
        { type, title: 'Microsoft ' + type, company: 'Microsoft', domain: domain || 'IT', paid, location: 'Bangalore' },
        { type, title: 'Amazon ' + type, company: 'Amazon', domain: domain || 'IT', paid, location: 'Hyderabad' },
        { type, title: 'Startup ' + type, company: 'Local Startup', domain: domain || 'Management', paid: false, location: 'Local' }
    ];

    const updates = mockData.map(item => {
        const filter = {
            type: item.type,
            title: item.title,
            company: item.company,
            domain: item.domain
        };

        return Opportunity.updateOne(filter, { $set: item }, { upsert: true });
    });

    await Promise.all(updates);
    return Opportunity.find({ type, paid, domain: domain || { $exists: true } }).lean().limit(20);
}

module.exports = router;

