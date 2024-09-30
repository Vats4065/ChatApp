// src/components/UsersPage.js
import React, { useEffect, useState } from "react";
import { ListGroup, Container, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth"; // Custom hook for authentication
import axios from "axios";
import io from "socket.io-client";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // Store online users
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useAuth(); // Get the current authenticated user and login status
  const navigate = useNavigate();
  const item = localStorage.getItem("token");

  useEffect(() => {
    console.log(item);
    if (item) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [item, navigate]);

  useEffect(() => {
    const socket = io.connect("http://localhost:8080"); // Connect to your WebSocket server
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/auth/getAllUser"
        );

        const filteredUsers = response.data.users.filter(
          (otherUser) => otherUser._id !== user.userId
        );
        setUsers(filteredUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();

    socket.on("update-online-users", (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.disconnect();
    };
  }, [user.userId]);

  const handleUserClick = (recipientId) => {
    navigate(`/chat/${recipientId}`);
  };

  const isUserOnline = (userId) => {
    console.log(userId);
    console.log(onlineUsers);
    return onlineUsers.includes(userId);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Container className="mt-4">
      <h2>All Users</h2>
      {isLoggedIn && <h4>User is logged in</h4>}{" "}
      {/* Display if user is logged in */}
      <ListGroup>
        {users.map((otherUser) => (
          <ListGroup.Item
            key={otherUser._id}
            action
            onClick={() => handleUserClick(otherUser._id)}
          >
            {otherUser.username}
            {isUserOnline(otherUser._id) ? (
              <Badge bg="success" className="ms-2">
                Online
              </Badge>
            ) : (
              <Badge bg="secondary" className="ms-2">
                Offline
              </Badge>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {users.length === 0 && (
        <>
          <h4>No Users Available</h4>
        </>
      )}
    </Container>
  );
};

export default UsersPage;
