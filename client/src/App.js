/**
 * App.js
 * The Main Entry Point.
 * Handles Routing (Navigation) and Global Theme State.
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import './styles/auth.css';

// We will create these files in the next steps!
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
//import Dashboard from './components/Dashboard/Dashboard';

function App() {
  // STATE: Manage Theme (Light = false, Dark = true)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // FUNCTION: Toggle the theme state
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    // DYNAMIC CLASS: Adds 'dark-mode' or 'light-mode' to the main container based on state
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      
      {/* Background Layer (The Waves) */}
      <div className="wave-background"></div>

      {/* Router handles the URL changes */}
      <Router>
        <Routes>
          
          {/* Route 1: REGISTER PAGE */}
          <Route 
            path="/register" 
            element={<RegisterPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} 
          />

          {/* Route 2: LOGIN PAGE */}
          <Route 
            path="/login" 
            element={<LoginPage toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} 
          />

          {/* Default Redirect: Go to Login if URL is unknown */}
          <Route path="*" element={<Navigate to="/login" />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;