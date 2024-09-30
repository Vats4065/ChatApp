// src/components/Navbar.js
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import { useAuth } from "../utils/auth";

const Navigation = ({ theme, toggleTheme }) => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
              {/* <Nav.Link as={Link} to="/chat">
                Chat
              </Nav.Link> */}
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
