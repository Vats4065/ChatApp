// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // Ensure this path is correct
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <Main /> {/* Main component will utilize the Theme context */}
    </ThemeProvider>
  );
}

// Create a separate Main component to utilize the Theme context
const Main = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme}>
      <Router>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/chat" element={<PrivateRoute />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;
