// src/pages/ChatPage.js
import React from 'react';
import Chat from '../components/Chat';
import { Container } from 'react-bootstrap';

import { useTheme } from '../context/ThemeContext';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const { recipientId } = useParams()

    const theme = useTheme()
    return (
        <Container className={`chat-container ${theme}-theme`}>
            <Chat id={recipientId} />
        </Container>

    )
};

export default ChatPage;
