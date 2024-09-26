const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' }
});


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


let onlineUsers = {};

io.on('connection', (socket) => {
    socket.on('user-joined', (userId) => {
        onlineUsers[userId] = socket.id;
        User.findByIdAndUpdate(userId, { isOnline: true }).exec();
        io.emit('update-users', onlineUsers);
    });

    socket.on('disconnect', () => {
        for (const [userId, socketId] of Object.entries(onlineUsers)) {
            if (socketId === socket.id) {
                User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() }).exec();
                delete onlineUsers[userId];
            }
        }
        io.emit('update-users', onlineUsers);
    });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
