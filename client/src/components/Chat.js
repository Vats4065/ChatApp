import React, { useState, useEffect, useRef } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useAuth } from '../utils/auth';
import io from 'socket.io-client';
import MessageInput from './MessageInput';
import './Chat.css';
import axios from 'axios';
import { format } from 'date-fns-tz';

const ChatPage = ({ id }) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [recipientId,] = useState(id);
    const [recipientUser, setRecipientUser] = useState();
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const chatWindowRef = useRef(null);

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
                console.log(response);
            } catch (err) {
                console.error('Failed to load messages:', err);
                setError('Failed to load messages.');
            }
        };

        fetchMessages();
    }, [recipientId, user?.userId]);

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

        newSocket.on('message', (msg) => {
            if (msg.sender !== user.userId) {
                setMessages((prev) => {
                    if (!prev.find(existingMsg => existingMsg._id === msg._id)) {
                        return [...prev, msg];
                    }
                    return prev;
                });
            }
        });

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

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (msgData) => {
        // console.log(msgData);
        // if (!msgData.content || !recipientId || !msgData) {
        //     setError('Message and recipient cannot be empty');
        //     return;
        // }

        const msg = {
            ...msgData,
            recipient: recipientId,
            sender: user.userId,
            seen: false,
            createdAt: new Date().toISOString(),
        };


        setMessages((prevMessages) => [...prevMessages, msg]);


        socket.emit('send-message', msg, (response) => {
            if (response.error) {
                setError(response.error);
            } else {
                socket.emit('seen-message', { messageId: msg._id, recipient: recipientId });
            }
        });
    };





    return (
        <Container className="chat-container ">

            {error && <Alert variant="danger">{error}</Alert>}
            <div className="user-list">
                <h5 className='text-dark'>
                    Chatting with: {recipientUser?.username}
                </h5>
            </div>
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg) => (
                    <div key={msg._id} className={msg.sender === user.userId ? 'my-message' : 'other-message'}>
                        <div className={msg.sender === user.userId ? 'message-sender' : 'message-receiver'}>
                            <span>{msg.content}</span>
                            {msg.mediaUrl && (
                                <img src={`http://localhost:8080${msg.mediaUrl}`} alt="attachment" className="message-media" />
                            )}
                            <span className="seen-status">
                                {msg.seen ? '✓✓' : '✓'}
                            </span>

                            <div className={`message-timestamp ${msg.sender === user.userId ? "text-light" : ""}`}>
                                {msg.createdAt ? format(new Date(msg.createdAt), 'hh:mm a') : 'N/A'}
                            </div>
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
