const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const User = require('./models/User');
const Message = require('./models/Message');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' },
});

app.set('io', io);

let onlineUsers = {};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineUsers[userId] = socket.id;
    }

    io.emit('update-online-users', Object.keys(onlineUsers));

    socket.on('disconnect', () => {
        delete onlineUsers[userId];
        io.emit('update-online-users', Object.keys(onlineUsers));
    });

    socket.on('send-message', async (msgData, callback) => {
        try {
            const { recipient, sender, content } = msgData;


            const message = new Message({
                sender,
                recipient,
                content,
                seen: false,
            });
            await message.save();


            if (onlineUsers[recipient]) {
                io.to(onlineUsers[recipient]).emit('message', {
                    sender,
                    content,
                    recipient,
                    messageId: message._id,
                    seen: false,
                });
            }

            callback({ success: true, messageId: message._id });
        } catch (error) {
            console.error("Error sending message:", error);
            callback({ error: "Failed to send message" });
        }
    });

    socket.on('typing', ({ recipient }) => {
        if (onlineUsers[recipient]) {
            io.to(onlineUsers[recipient]).emit('typing', { userId, typing: true });
        }
    });

    socket.on('seen-message', async ({ messageId, recipient }) => {
        try {

            await Message.updateOne({ _id: messageId }, { $set: { seen: true } });


            if (onlineUsers[recipient]) {
                io.to(onlineUsers[recipient]).emit('message-seen', { messageId });
            }
        } catch (error) {
            console.error("Error marking message as seen:", error);
        }
    });


    socket.on('join-room', ({ roomId }) => {
        socket.join(roomId);
    });

    socket.on('leave-room', ({ roomId }) => {
        socket.leave(roomId);
    });
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
