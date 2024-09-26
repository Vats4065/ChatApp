// src/utils/auth.js
import { useState, useEffect } from 'react';

// Function to save the token to local storage
export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

// Function to retrieve the token from local storage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Function to remove the token from local storage (logout)
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Function to check if the user is logged in
export const isLoggedIn = () => {
    const token = getToken();
    return !!token; // Returns true if token exists, false otherwise
};

// Function to decode the token and get user info
export const getUserInfo = () => {
    const token = getToken();
    if (!token) return null;

    // Decode the token (assuming it's a JWT)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload; // Return the decoded payload
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

// Custom hook for authentication
export const useAuth = () => {
    const [user, setUser] = useState(getUserInfo());

    useEffect(() => {
        const token = getToken();
        if (token) {
            setUser(getUserInfo());
        } else {
            setUser(null);
        }
    }, []);

    const login = (token) => {
        saveToken(token);
        setUser(getUserInfo());
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    };
};

// Export isAuthenticated for use in PrivateRoute
export const isAuthenticated = () => !!getToken();
