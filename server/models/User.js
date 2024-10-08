const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    photoUrl: { type: String },
    otp: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
