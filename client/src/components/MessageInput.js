import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsEmojiSmile, BsPaperclip, BsSend } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import './MessageInput.css';
import axios from 'axios';

const MessageInput = ({ socket, userId, recipientId, onSendMessage, onTyping }) => {
    const [message, setMessage] = useState('');
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (message.trim() || selectedFile) {
            const formData = new FormData();
            formData.append('content', message); // Append the message content
            formData.append('recipient', recipientId); // Append the recipient
            if (selectedFile) {
                formData.append('media', selectedFile); // Append the file
            }

            try {
                const response = await axios.post('http://localhost:8080/api/chat/message', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                // Emit the message
                onSendMessage(response.data);
                setMessage('');
                setSelectedFile(null);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Store the selected file
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        onTyping();  // Emit typing event when input changes
    };

    return (
        <Form onSubmit={handleSendMessage} className="message-input-form">
            <Button className="emoji-button" variant="secondary" onClick={() => setEmojiPicker(!emojiPicker)}>
                <BsEmojiSmile />
            </Button>
            {emojiPicker && (
                <EmojiPicker
                    onEmojiClick={(event, emojiObject) => {
                        if (emojiObject && emojiObject.emoji) {
                            setMessage(prev => prev + emojiObject.emoji); // Append selected emoji to message
                        }
                    }}
                    className={`emoji-picker w-75 ${emojiPicker ? 'show' : ''}`}
                />
            )}
            <Form.Control
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange} // Use handleInputChange here
                className="message-input"
            />
            <Button className="attachment-button me-2" variant="secondary" onClick={() => document.getElementById('fileInput').click()}>
                <BsPaperclip />
            </Button>
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {selectedFile && <span className="selected-file">{selectedFile.name}</span>}
            <Button className="send-button" type="submit" variant='secondary'>
                <BsSend />
            </Button>
        </Form>
    );
};

export default MessageInput;
