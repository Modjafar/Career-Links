/* eslint-env node */\n/* global require, module */\n\nconst mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
