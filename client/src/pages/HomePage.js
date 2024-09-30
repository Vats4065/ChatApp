// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../utils/auth';
import axios from 'axios';


const HomePage = () => {
    const { theme } = useTheme();
    const { isAuthenticated, user } = useAuth();
    const [userInfo, setUser] = useState()

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/auth/me/${user.userId}`)

                setUser(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        getUserInfo()
    }, [user])


    return (
        <div className={`text-center  mt-5 ${theme}-theme`}>
            <h1>Welcome to ChatApp</h1>
            {user && (<><h3>Logged in as {userInfo?.username}</h3></>)}

            {!isAuthenticated && (<><Button as={Link} to="/login" className="m-2">Login</Button><Button as={Link} to="/register" className="m-2">Register</Button></>)}
        </div >

    )
};

export default HomePage;
