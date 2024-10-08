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
        if (user) {
            const getUserInfo = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/auth/me/${user.userId}`)
                    setUser(response.data)
                } catch (error) {
                    console.log(error);
                }
            }
            if (user.email) {
                setUser(user)
            }
            else {
                getUserInfo()
            }
        }
    }, [])

    return (
        <div className={`text-center  mt-5 ${theme}-theme`}>
            <h1>Welcome to ChatApp</h1>
            {user && (<><h3>Logged in as {userInfo?.username || userInfo?.name}</h3></>)}

            {!isAuthenticated && (<><Button as={Link} to="/login" className="m-2">Login</Button><Button as={Link} to="/register" className="m-2">Register</Button></>)}
        </div >

    )
};

export default HomePage;
