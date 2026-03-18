/* eslint-env node */\n/* global require, module, process, console */\n\nconst mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Set strictQuery to avoid deprecation warning
        mongoose.set('strictQuery', false);

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected Successfully ✅');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
