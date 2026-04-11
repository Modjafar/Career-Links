/* eslint-env node */
/* global require, module */
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.header('Authorization');

    // Handle Bearer token
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Role check if required
        if (req.user.role && req.roleRequired && !['admin', 'user'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = authMiddleware;
