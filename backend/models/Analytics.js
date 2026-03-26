/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true // Allow null for anonymous
    },
    page: String, // e.g. 'index', 'dashboard'
    action: {
        type: String,
        enum: ['view', 'click', 'save', 'apply', 'search']
    },
    domain: String, // IT, Finance etc.
    itemTitle: String, // If click/save specific item
    timestamp: {
        type: Date,
        default: Date.now
    },
    sessionId: String // Optional for tracking sessions
}, {
    timestamps: true
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);

