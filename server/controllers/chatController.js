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


    if (!req.user.userId || !recipient) {
        return res.status(400).json({ error: 'Sender or recipient ID is missing.' });
    }

    try {
        const newMessage = new Message({
            sender: req.user.userId,
            recipient,
            content,
            mediaUrl: req.file ? `/uploads/${req.file.filename}` : '',
        });

        await newMessage.save();

        // Emit the new message to the relevant recipient
        req.app.get('io').emit('message', newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.getMessages = async (req, res) => {

    const { recipient } = req.params;
    const { currentUser } = req.body





    try {
        const messages = await Message.find({
            $or: [
                { sender: currentUser, recipient },
                { sender: recipient, recipient: req.user.userId }
            ]
        }).sort({ createdAt: 1 });

        console.log(messages);

        res.json(messages);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


exports.handleTyping = (req, res) => {
    const { recipient } = req.body;

    if (!recipient) {
        return res.status(400).json({ error: 'Recipient ID is missing.' });
    }

    // Emit typing event to the recipient
    req.app.get('io').emit('typing', {
        userId: req.user.userId,
        recipient,
    });

    res.status(200).json({ message: 'Typing event emitted' });
};


exports.handleMessageSeen = async (req, res) => {
    const { messageId, recipient } = req.body;

    if (!messageId || !recipient) {
        return res.status(400).json({ error: 'Message ID or recipient ID is missing.' });
    }

    try {
        // Update the message in the database to mark it as seen
        await Message.updateOne({ _id: messageId }, { $set: { seen: true } });

        // Emit a message-seen event to the sender as well
        const message = await Message.findById(messageId);
        req.app.get('io').emit('message-seen', {
            messageId,
            recipient,
            seenBy: message.sender, // Sender of the message
        });

        res.status(200).json({ message: 'Message marked as seen' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark message as seen' });
    }
};
