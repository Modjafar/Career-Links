/* eslint-env node */
/* global require, module */
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
