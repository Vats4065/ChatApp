import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsEmojiSmile, BsPaperclip, BsSend } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import './MessageInput.css';
import axios from 'axios';

const MessageInput = ({ socket, userId, recipientId, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);



    const handleSendMessage = async (e) => {


        e.preventDefault();
        if (message.trim() || selectedFile) {
            const msgData = {
                sender: userId,
                recipient: recipientId,
                content: message,
                timestamp: new Date(),
                media: selectedFile ? `/uploads/${selectedFile}` : null,
                seen: false,
            };



            const postmessages = await axios.post(`http://localhost:8080/api/chat/message`, msgData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            console.log(postmessages);

            onSendMessage(msgData);
            setMessage('');
            setSelectedFile(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file.name);

        }
    };

    return (
        <Form onSubmit={handleSendMessage} className="message-input-form">
            <Button className="emoji-button" variant="light" onClick={() => setEmojiPicker(!emojiPicker)}>
                <BsEmojiSmile />
            </Button>
            {emojiPicker && (
                <EmojiPicker
                    onEmojiClick={(event, emojiObject) => {
                        if (emojiObject && emojiObject.emoji) {
                            setMessage(prev => prev + emojiObject.emoji); // Append emoji to message
                        }
                    }}
                    className={`emoji-picker ${emojiPicker ? 'show' : ''}`} // Add show class conditionally
                />
            )}
            <Form.Control
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="message-input"
            />
            <Button className="attachment-button" variant="light" onClick={() => document.getElementById('fileInput').click()}>
                <BsPaperclip />
            </Button>
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {selectedFile && <span className="selected-file">{selectedFile}</span>}
            <Button className="send-button" variant="primary" type="submit">
                <BsSend />
            </Button>
        </Form>
    );
};

export default MessageInput;
