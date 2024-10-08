import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { useTheme } from "../../context/ThemeContext";
import "./auth.css";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../../utils/firebase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        login(data.token);
        toast.success("Logged in successfully!");

        navigate("/");
        window.location.reload();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  const handleGoogle = async () => {
    signInWithPopup(auth, provider).then((data) => {
      console.log(data);
      login(data.user.accessToken);
      setEmail(data.user.email);

      toast.success("Logged in successfully with Google!");
      navigate("/");
      window.location.reload();
    });
  };

  return (
    <Container className={`auth-container login-bg ${theme}-theme`}>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
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

        <Button variant="primary" type="submit" className="mt-4 mb-3 w-100">
          Login
        </Button>

        <Form.Text className="forgot-link ">
          <Link to="/forgot-password" className="forgot-link fw-bolder">
            Forgot Password?
          </Link>
        </Form.Text>

        <Form.Text className="mt-3 text-decoration-none w-100 d-block text-center text-light fw-bolder">
          OR
        </Form.Text>
        <Button className="google-btn mt-4 w-100 " onClick={handleGoogle}>
          <FcGoogle className="google-icon" />
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
