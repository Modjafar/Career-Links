/* eslint-env node */
/* global require, module */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

