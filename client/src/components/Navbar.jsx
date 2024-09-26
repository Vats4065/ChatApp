import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import { useAuth } from "../utils/auth";

const Navigation = ({ theme, toggleTheme }) => {
  const { logout } = useAuth(); // Using useAuth to get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Logout via the useAuth hook
    navigate("/login"); // Redirect to login page
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand as={Link} to="/">
        ChatApp
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/chat">
          Chat
        </Nav.Link>
        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        <Nav.Link onClick={toggleTheme}>
          {theme === "light" ? <BsMoon /> : <BsSun />}
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
