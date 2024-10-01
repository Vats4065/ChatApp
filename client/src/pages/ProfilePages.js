import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/auth';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Image, Form } from 'react-bootstrap';
import { BsPerson, BsEnvelope, BsPencilSquare } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/auth/me/${user?.userId}`);
                setUserInfo(response.data);
                setProfileImage(response.data.profileImage);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        getUserInfo();
    }, [user]);


    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImage', file);

            axios
                .post(`http://localhost:8080/api/auth/upload-profile-image/${user?.userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((response) => {
                    setProfileImage(response.data.profileImage);
                    setIsEditingImage(false);
                })
                .catch((error) => {
                    console.error('Error uploading profile image:', error);
                });
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className={`profile-card text-center shadow ${theme === "dark" ? "bg-light text-dark" : "bg-dark text-light"}`}>
                        <Card.Header>
                            <h2>Your Profile</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="profile-image-container mb-4">
                                <Image
                                    src={profileImage || 'https://via.placeholder.com/150'}
                                    roundedCircle
                                    className="profile-image mb-3"
                                    alt="Profile"
                                />
                                {!isEditingImage ? (
                                    <Button variant="outline-light" onClick={() => setIsEditingImage(true)}>
                                        <BsPencilSquare /> Edit Image
                                    </Button>
                                ) : (
                                    <Form.Group controlId="formFile" className="mt-3">
                                        <Form.Control type="file" onChange={handleProfileImageChange} />
                                    </Form.Group>
                                )}
                            </div>
                            <Card.Text>
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <BsPerson size={30} className="me-2" />
                                    <strong>Username:</strong> {userInfo?.username}
                                </div>
                                <div className="d-flex align-items-center justify-content-center mb-3">
                                    <BsEnvelope size={30} className="me-2" />
                                    <strong>Email:</strong> {userInfo?.email}
                                </div>
                            </Card.Text>
                            <Button variant="primary" href="/settings">
                                Edit Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
