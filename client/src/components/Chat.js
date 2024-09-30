import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useAuth } from '../utils/auth';
import io from 'socket.io-client';
import MessageInput from './MessageInput';
import './Chat.css';
import axios from 'axios';

const ChatPage = ({ id }) => {
    const [messages, setMessages] = useState([]); // Use a single messages array
    const [error, setError] = useState(null);
    const [recipientId, setRecipientId] = useState(id);
    const [recipientUser, setRecipientUser] = useState();
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    // Fetch messages from the server
    useEffect(() => {
        const fetchMessages = async () => {
            if (!recipientId || !user?.userId) return;

            try {
                const response = await axios.get(`http://localhost:8080/api/chat/messages/${recipientId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setMessages(response.data);
            } catch (err) {
                console.error('Failed to load messages:', err);
                setError('Failed to load messages.');
            }
        };

        fetchMessages();
    }, [recipientId, user?.userId]);

    // Fetch recipient user information
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/auth/me/${recipientId}`);
                setRecipientUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user info', error);
                setError('Failed to fetch recipient information.');
            }
        };

        getUserInfo();

        const newSocket = io.connect('http://localhost:8080', {
            query: { userId: user.userId },
        });


        setSocket(newSocket);

        // Listen for incoming messages
        newSocket.on('message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        // Listen for message seen updates
        newSocket.on('message-seen', ({ messageId }) => {
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg._id === messageId ? { ...msg, seen: true } : msg
                )
            );
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user.userId, recipientId]);

    // Handle sending messages
    const handleSendMessage = (msgData) => {
        if (!msgData.content || !recipientId) {
            setError('Message and recipient cannot be empty');
            return;
        }

        const msg = {
            ...msgData,
            recipient: recipientId,
            sender: user.userId,
            seen: false,
        };

        // Optimistically update the UI
        setMessages((prevMessages) => [...prevMessages, msg]);

        // Emit the message to the server
        socket.emit('send-message', msg, (response) => {
            if (response.error) {
                setError(response.error);
            } else {
                // Emit event to mark message as seen for the recipient
                socket.emit('seen-message', { messageId: msg._id, recipient: recipientId });
            }
        });
    };

    // Handle user selection
    const handleUserSelect = (id) => {
        setRecipientId(id);
        setMessages([]); // Clear messages when user changes
    };

    return (
        <Container className="chat-container">
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="user-list">
                <h5>Chatting with: {recipientUser?.username}</h5>
            </div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === user.userId ? 'my-message' : 'other-message'}>
                        <div className={msg.sender === user.userId ? 'message-sender' : 'message-receiver'}>
                            <span>{msg.content}</span>
                            {msg.mediaUrl && <img src={msg.mediaUrl} alt="attached" className="message-media" />}
                            <span className="seen-status">
                                {msg.seen ? '✓✓' : '✓'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput
                socket={socket}
                userId={user.userId}
                recipientId={recipientId}
                onSendMessage={handleSendMessage}
            />
        </Container>
    );
};

export default ChatPage;
