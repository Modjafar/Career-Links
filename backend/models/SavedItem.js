/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

const SavedItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    opportunityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    },
    item: { // Fallback if no Opportunity ID
        type: {
            type: String,
            enum: ['internship', 'job', 'course']
        },
        title: String,
        company: String,
        platform: String,
        domain: String,
        paid: Boolean,
        location: String,
        url: String
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SavedItem', SavedItemSchema);

