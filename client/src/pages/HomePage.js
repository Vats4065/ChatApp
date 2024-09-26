// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const HomePage = () => (
    <Container className="text-center mt-5">
        <h1>Welcome to ChatApp</h1>
        <Button as={Link} to="/login" className="m-2">Login</Button>
        <Button as={Link} to="/register" className="m-2">Register</Button>
    </Container>
);

export default HomePage;
