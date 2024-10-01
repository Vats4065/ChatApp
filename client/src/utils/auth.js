import axios from 'axios';
import { useState, useEffect } from 'react';

export const saveToken = (token) => {
    const now = new Date().getTime();
    const expiryTime = now + 3600000;
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', expiryTime);
};

export const handleLogout = async (user) => {

    try {
        const res = await axios.put(`http://localhost:8080/api/auth/logout/${user?.userId}`);

        console.log(res)
    } catch (error) {
        console.error("Error while logging out:", error);
    }
};


export const getToken = (user) => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('tokenExpiry');
    const now = new Date().getTime();

    if (expiryTime && now > expiryTime) {
        removeToken();
        handleLogout(user);

        return null;
    }

    return token;
};


export const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
};



export const isLoggedIn = () => {
    const token = getToken();
    console.log(token);
    return !!token;
};



export const getUserInfo = (user) => {
    const token = getToken(user);
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};



export const useAuth = () => {
    const [user, setUser] = useState(getUserInfo());
    useEffect(() => {
        const token = getToken();
        if (token) {
            setUser(getUserInfo(user));
        } else {
            setUser(null);
        }
    }, [user]);


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
        getToken
    };
};

export const isAuthenticated = () => !!getToken();