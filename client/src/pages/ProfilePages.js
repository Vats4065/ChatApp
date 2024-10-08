import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/auth';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { BsPerson, BsEnvelope } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';

const ProfilePage = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const { theme } = useTheme()
    useEffect(() => {
        console.log(user);
        const getUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/auth/me/${user?.userId}`);
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        if (user.email) {
            setUserInfo(user);
        }
        else {
            getUserInfo();

        }

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
                                    <strong className='me-2'>Username: </strong> {userInfo?.username || userInfo?.name}
                                </div>
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <BsEnvelope size={30} className="me-2" />
                                    <strong className='me-2'>Email: </strong> {userInfo?.email}
                                </div>

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
