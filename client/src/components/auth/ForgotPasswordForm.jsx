import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import "./auth.css";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Password reset link sent to your email!");
        navigate("/verify-otp");
      } else {
        toast.error(data.message);
        toast.error("you have to signup first with valid email");
      }
    } catch (error) {
      toast.error("Failed to send reset link!");
    }
  };

  return (
    <Container className={`auth-container ${theme}-theme`}>
      <h2>Forgot Password</h2>
      <Form onSubmit={handleForgotPassword}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4 w-100">
          Send Reset Link
        </Button>
      </Form>
    </Container>
  );
};

export default ForgotPasswordForm;
