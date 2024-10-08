import React, { useEffect, useState } from "react";
import { ListGroup, Container, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import axios from "axios";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setIsLoggedIn] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const socket = io.connect("http://localhost:8000");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/getAllUser"
        );
        const filteredUsers = response.data.users.filter(
          (otherUser) => otherUser._id !== user.userId
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    socket.on("update-online-users", (data) => {
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
          [msg.sender]: (prev[msg.sender] || 0) + 1,
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
