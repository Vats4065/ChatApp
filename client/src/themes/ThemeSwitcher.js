// src/components/ThemeSwitcher.js
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Button onClick={toggleTheme} variant="secondary" className="theme-switcher">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
    );
};

export default ThemeSwitcher;
