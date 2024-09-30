// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // User IDs in the room
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Reference to the last message sent in the room
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
