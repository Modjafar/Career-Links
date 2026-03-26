/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['internship', 'job', 'course'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: String, // for jobs/internships
    platform: String, // for courses
    domain: {
        type: String,
        enum: ['IT', 'Finance', 'Management', 'Ecommerce', 'Government', 'English'],
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    location: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);

