const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');

// Configure multer for media uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

exports.upload = multer({ storage });

exports.sendMessage = async (req, res) => {
    const { content, recipient } = req.body;
    try {
        const newMessage = new Message({
            sender: req.user.userId,
            recipient,
            content,
            mediaUrl: req.file ? `/uploads/${req.file.filename}` : '',
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.getMessages = async (req, res) => {
    const { recipient } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.userId, recipient },
                { sender: recipient, recipient: req.user.userId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
