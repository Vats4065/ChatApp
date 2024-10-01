import axios from 'axios';
import { useState, useEffect } from 'react';

// Function to save the token to local storage
// Function to save the token to local storage with an expiration time
export const saveToken = (token) => {
    const now = new Date().getTime();
    const expiryTime = now + 3600000; // 1 hour in milliseconds
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', expiryTime); // Store the expiration time
};

export const handleLogout = async (user) => {

    try {
        const res = await axios.put(`http://localhost:8080/api/auth/logout/${user?.userId}`);

        console.log(res)
    } catch (error) {
        console.error("Error while logging out:", error);
    }
};

// Function to retrieve the token from local storage and check if it's expired
export const getToken = (user) => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('tokenExpiry');
    const now = new Date().getTime();

    if (expiryTime && now > expiryTime) {
        // If the current time is past the expiry time, remove the token and return null

        removeToken();
        handleLogout(user);

        return null;
    }

    return token;
};

// Function to remove the token from local storage (logout)
export const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry'); // Also remove the expiration time
};


// Function to check if the user is logged in
export const isLoggedIn = () => {
    const token = getToken();
    console.log(token);
    return !!token; // Returns true if token exists, false otherwise
};

// Function to decode the token and get user info
export const getUserInfo = (user) => {
    const token = getToken(user);
    if (!token) return null;

    // Decode the token (assuming it's a JWT)
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        return payload; // Return decoded payload as user info
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

// Custom hook for authentication
export const useAuth = () => {
    const [user, setUser] = useState(getUserInfo()); // Initialize user state from token

    useEffect(() => {
        const token = getToken();
        if (token) {
            setUser(getUserInfo(user)); // Set user from token if present
        } else {
            setUser(null); // No token means no user is logged in
        }
    }, [user]);

    // Function to log in a user
    const login = (token) => {
        saveToken(token); // Save the token in local storage
        setUser(getUserInfo()); // Set the decoded user information in state
    };

    // Function to log out a user
    const logout = () => {
        removeToken(); // Remove the token from local storage
        setUser(null); // Clear the user information from state

    };

    return {
        user, // The user object or null if not logged in
        isAuthenticated: !!user, // Boolean flag for authentication status
        login, // Function to log in
        logout, // Function to log out
        getToken // Expose the getToken function if needed
    };
};

// Function to check if the user is authenticated for private routes
export const isAuthenticated = () => !!getToken();
