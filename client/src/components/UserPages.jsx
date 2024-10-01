import React, { useEffect, useState } from "react";
import { ListGroup, Container, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth"; // Custom hook for authentication
import axios from "axios";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns"; // Import date-fns for time formatting

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setIsLoggedIn] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({}); // Track unread messages
  const { user } = useAuth(); // Get the current authenticated user and login status
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Token for API requests

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

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
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false in both success and error cases
      }
    };

    fetchUsers();

    // Listen for real-time updates on user online status
    socket.on("update-online-users", (data) => {
      // Find the user whose status changed and update their information
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === data.userId
            ? { ...u, isOnline: data.isOnline, lastSeen: data.lastSeen }
            : u
        )
      );
    });

    socket.on("message", (msg) => {
      if (msg.recipient === user.userId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1, // Increment unread count for sender
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user.userId]);

  const handleUserClick = (recipientId) => {
    navigate(`/chat/${recipientId}`);
    setUnreadMessages((prev) => ({
      ...prev,
      [recipientId]: 0,
    }));
  };

  const isUserOnline = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.isOnline : false;
  };

  const getLastSeen = (lastSeen) => {
    return formatDistanceToNow(new Date(lastSeen), { addSuffix: true });
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>All Users</h2>

      {/* Display if user is logged in */}
      <ListGroup>
        {users.length > 0 ? (
          users.map((otherUser) => (
            <ListGroup.Item
              key={otherUser._id}
              action
              onClick={() => handleUserClick(otherUser._id)}
              className="mb-3 border rounded"
            >
              {otherUser.username}
              {unreadMessages[otherUser._id] > 0 && (
                <Badge bg="danger" className="ms-2">
                  {unreadMessages[otherUser._id]}
                </Badge>
              )}
              {isUserOnline(otherUser._id) ? (
                <Badge bg="success" className="ms-2">
                  Online
                </Badge>
              ) : (
                <>
                  <Badge bg="secondary" className="ms-2">
                    Offline
                  </Badge>
                  {otherUser.lastSeen && (
                    <span className="ms-2 text-muted">
                      Active {getLastSeen(otherUser.lastSeen)}
                    </span>
                  )}
                </>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <h4>No Users Available</h4>
        )}
      </ListGroup>
    </Container>
  );
};

export default UsersPage;
