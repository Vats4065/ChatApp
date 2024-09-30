// src/components/auth/RegisterForm.js
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; // Import ThemeContext
import "./auth.css";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme(); // Destructure theme from ThemeContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Registered successfully!");
        navigate("/login");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Registration failed!");
    }
  };

  return (
    <Container className={`auth-container register-bg ${theme}-theme`}>
      <h2 className="text-center">Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4 w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterForm;
