/* client/src/components/PasswordCriteria.js */
import React from 'react';

const PasswordCriteria = ({ criteria }) => {
    // רשימת החוקים לתצוגה
    const rules = [
        { key: 'length', label: 'At least 8 characters' },
        { key: 'upper', label: 'Uppercase Letter (A-Z)' },
        { key: 'lower', label: 'Lowercase Letter (a-z)' },
        { key: 'number', label: 'Number (0-9)' },
        { key: 'special', label: 'Special Character (!@#$)' }
    ];

    return (
        <div className="validation-box">
            <p style={{fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', opacity: 0.9}}>
                Password Requirements:
            </p>
            
            {rules.map((rule) => (
                <div key={rule.key} className={`validation-item ${criteria[rule.key] ? 'valid' : 'invalid'}`}>
                    {/* כאן העיגול (status-dot) מחליף את הסימנים */}
                    <span className={`status-dot ${criteria[rule.key] ? 'valid' : 'invalid'}`}></span>
                    {rule.label}
                </div>
            ))}
        </div>
    );
};

export default PasswordCriteria;