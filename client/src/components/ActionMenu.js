import React, { useState, useRef, useEffect } from 'react';
import '../styles/actionMenu.css';

const ActionMenu = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // סגירה של התפריט כשלוחצים מחוץ לו
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="action-menu-container" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button 
                className="kebab-btn" 
                onClick={() => setIsOpen(!isOpen)}
                title="More actions"
            >
                ⋮
            </button>

            {isOpen && (
                <div className="action-dropdown-menu">
                    {actions.map((action, index) => (
                        <div 
                            key={index} 
                            className={`action-menu-item ${action.danger ? 'danger' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation(); // מונע פתיחה של הקובץ כשלוחצים על כפתור בתפריט
                                action.onClick();
                                setIsOpen(false);
                            }}
                        >
                            <span className="action-menu-icon">{action.icon}</span>
                            <span className="action-menu-label">{action.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActionMenu;