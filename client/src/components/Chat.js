// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { BsEmojiSmile, BsPaperclip } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../utils/auth';
import io from 'socket.io-client';


const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [emojiPicker, setEmojiPicker] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Socket connection for incoming messages
        const socket = io.connect('http://localhost:8080');
        socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));

        return () => socket.disconnect();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const socket = io.connect('http://localhost:8080');
        socket.emit('sendMessage', { message, userId: user.id });
        setMessage('');
    };

    return (
        <Container>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <Form onSubmit={handleSendMessage} className="d-flex mt-3">
                <Button variant="light" onClick={() => setEmojiPicker(!emojiPicker)}>
                    <BsEmojiSmile />
                </Button>
                {emojiPicker && <EmojiPicker onEmojiClick={(e, emojiObject) => setMessage(message + emojiObject.emoji)} />}
                <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow-1"
                />
                <Button variant="light" onClick={() => document.getElementById('fileInput').click()}>
                    <BsPaperclip />
                </Button>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={(e) => console.log(e.target.files[0])}
                />
                <Button variant="primary" type="submit">Send</Button>
            </Form>
        </Container>
    );
};

export default Chat;
