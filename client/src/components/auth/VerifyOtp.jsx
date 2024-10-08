import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";
// import { useAuth } from "../../utils/auth";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  // const { user } = useAuth();
  const navigate = useNavigate();

  //   useEffect(() => {
  //     const getUser = async () => {
  //       const response = await axios.post(
  //         `http://localhost:8000/api/auth/me/${user.userId}`
  //       );
  //       const data = response.json();
  //       setEmail(data.email);
  //     };

  //     getUser();
  //   });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            userOtp: otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP verified successfully!");
        setIsVerified(true);
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error verifying OTP");
    }
  };

  return (
    <Container className="verify-otp-container">
      <div className="verify-otp-box">
        <h2 className="text-center">Verify OTP</h2>
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

          <Form.Group controlId="formOtp" className="mt-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Verify OTP
          </Button>
        </Form>

        {isVerified && (
          <div className="verified-message mt-3">
            <p>OTP Verified! Redirecting to reset password...</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default VerifyOtp;
