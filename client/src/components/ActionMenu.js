/* client/src/components/ActionMenu.js */
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../utils/Icons'; // Centralized icons
import '../styles/actionMenu.css';

const ActionMenu = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    /**
     * Closes the dropdown menu if a click is detected outside of the component area.
     */
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
                {/* Replaced ASCII dots with specialized SVG icon */}
                <Icons.MenuDots size={20} />
            </button>

            {isOpen && (
                <div className="action-dropdown-menu">
                    {actions.map((action, index) => (
                        <div 
                            key={index} 
                            className={`action-menu-item ${action.danger ? 'danger' : ''}`}
                            onClick={(e) => {
                                // Prevents the file from opening when an action item is clicked
                                e.stopPropagation(); 
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