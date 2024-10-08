import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./auth.css";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get the token from the URL
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to reset password!");
    }
  };

  return (
    <Container className={`auth-container ${theme}-theme`}>
      <h2>Reset Password</h2>
      <Form onSubmit={handleResetPassword}>
        <Form.Group controlId="formPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword" className="mt-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4 w-100">
          Reset Password
        </Button>
      </Form>
    </Container>
  );
};

export default ResetPasswordForm;
