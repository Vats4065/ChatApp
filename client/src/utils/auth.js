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
            setUser(getUserInfo()); // Set user from token if present
        } else {
            setUser(null); // No token means no user is logged in
        }
    }, []);

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
