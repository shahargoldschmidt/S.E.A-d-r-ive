/* client/src/pages/DashboardPage.js */
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

const DashboardPage = ({ toggleTheme, isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('My Drive');

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            {/* Navbar עליון שתופס את כל הרוחב */}
            <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            
            {/* גוף הדשבורד: Sidebar + תוכן */}
            <div className="dashboard-body">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                
                {/* אזור התוכן המשתנה */}
                <main className="main-content">
                    <h2 className="content-title">{activeTab}</h2>
                    
                    {/* תוכן זמני */}
                    <div style={{
                        display:'flex', 
                        flexDirection:'column', 
                        alignItems:'center', 
                        marginTop:'100px', 
                        opacity:0.6
                    }}>
                        <span style={{fontSize:'4rem'}}>🌊</span>
                        <h3>No files in this depth</h3>
                        <p>Use the "New Dive" button to upload content.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;