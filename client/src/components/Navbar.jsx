import React, { useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import { useAuth } from "../utils/auth";
import axios from "axios";

const Navigation = ({ theme, toggleTheme }) => {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/me/${user?.userId}`
        );
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.put(`http://localhost:8080/api/auth/logout/${user?.userId}`);

      // Proceed with logout
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error while logging out:", error);
      // Optionally handle error (e.g., show a notification)
    }
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="mb-4"
      style={{ zIndex: 1000 }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          ChatApp
        </Navbar.Brand>

        {/* Navbar Toggle for responsive menu */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Collapse contains the responsive menu links */}
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              <Nav.Link
                onClick={toggleTheme}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title={theme === "light" ? "Switch to Dark" : "Switch to Light"}
                style={{ "z-index": 99999 }}
              >
                {theme === "light" ? <BsMoon /> : <BsSun />}
              </Nav.Link>
            </Nav>
          )}
          {!isAuthenticated && (
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link
                onClick={toggleTheme}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title={theme === "light" ? "Switch to Dark" : "Switch to Light"}
              >
                {theme === "light" ? <BsMoon /> : <BsSun />}
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
