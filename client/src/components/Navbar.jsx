import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsSun, BsMoon, BsPerson } from "react-icons/bs";
import { useAuth } from "../utils/auth";
import axios from "axios";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";

const Navigation = ({ theme, toggleTheme }) => {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user.email) {
        await signOut(auth);
        logout();
      } else {
        await axios.put(
          `http://localhost:8000/api/auth/logout/${user?.userId}`
        );
      }
      logout();
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error while logging out:", error);
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

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item disabled>
                  <div className="d-flex align-items-center">
                    <BsPerson className="me-2" />
                    {user?.username}
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
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
