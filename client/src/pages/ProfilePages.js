// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/auth';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { BsPerson, BsEnvelope } from 'react-icons/bs'; // Profile and Email icons
import { useTheme } from '../context/ThemeContext';

const ProfilePage = () => {
    const { user } = useAuth(); // Get user details from auth context
    const [userInfo, setUserInfo] = useState(null);
    const { theme } = useTheme()
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/auth/me/${user?.userId}`);
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        getUserInfo();
    }, [user]);

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className={`text-center shadow ${theme === "dark" ? "bg-light text-dark" : "bg-dark text-light"}`}>
                        <Card.Header >
                            <h2>Your Profile</h2>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <BsPerson size={30} className="me-2" />
                                    <strong>Username:</strong> {userInfo?.username}
                                </div>
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <BsEnvelope size={30} className="me-2" />
                                    <strong>Email:</strong> {userInfo?.email}
                                </div>
                                {/* Add more profile details as necessary */}
                            </Card.Text>
                            <Button variant="primary" href="/settings">Edit Profile</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </Container >
    );
};

export default ProfilePage;
