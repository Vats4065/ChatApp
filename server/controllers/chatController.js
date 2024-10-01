const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    const { content, recipient } = req.body;
    let mediaUrl = null;


    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
    }

    if (!req.user.userId || !recipient) {
        return res.status(400).json({ error: 'Sender or recipient ID is missing.' });
    }

    try {
        const newMessage = new Message({
            sender: req.user.userId,
            recipient,
            content,
            mediaUrl,
        });

        await newMessage.save();
        req.app.get('io').emit('message', newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


exports.handleTyping = (req, res) => {
    const { recipient } = req.body;

    if (!recipient) {
        return res.status(400).json({ error: 'Recipient ID is missing.' });
    }


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

        await Message.updateOne({ _id: messageId }, { $set: { seen: true } });


        const message = await Message.findById(messageId);
        req.app.get('io').emit('message-seen', {
            messageId,
            recipient,
            seenBy: message.sender,
        });

        res.status(200).json({ message: 'Message marked as seen' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark message as seen' });
    }
};
