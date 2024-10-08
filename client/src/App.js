import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // Ensure this path is correct
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import UsersPage from './components/UserPages';
import { Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoArrowBackCircle, IoArrowForwardCircle } from 'react-icons/io5';
import ProfilePage from './pages/ProfilePages';
import { GoogleOAuthProvider } from "@react-oauth/google"
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import VerifyOtp from './components/auth/VerifyOtp';

function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
        <Main />
      </GoogleOAuthProvider>

    </ThemeProvider>
  );
}

const Main = () => {
  const { theme, toggleTheme } = useTheme();

  const handleGoback = () => {
    window.history.back();
  }

  const handleGoFormward = () => {
    window.history.forward();
  }


  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';

  }, [theme]);

  return (
    <Router>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
        <Container className='mb-2'>
          <div className='row'>

            <Button className='goBack me-3' onClick={handleGoback} type="submit" variant='secondary'>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-go-back">Go Back</Tooltip>}
              >
                <div>
                  <IoArrowBackCircle />
                </div>
              </OverlayTrigger>
            </Button>

            <Button className='goBack' onClick={handleGoFormward} type="submit" variant='secondary'>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-go-forward">Go Forward</Tooltip>}
              >
                <div>
                  <IoArrowForwardCircle />
                </div>
              </OverlayTrigger>
            </Button>

          </div>
        </Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<PrivateRoute />}>
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path='/profile' element={<ProfilePage />}></Route>
            <Route path='/settings' ></Route>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:recipientId" element={<ChatPage />} />

          </Route>
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
