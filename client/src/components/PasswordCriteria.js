/* client/src/components/PasswordCriteria.js */
import React from 'react';

// Constant definition for validation rules to ensure maintainability
const PASSWORD_RULES = [
    { key: 'length', label: 'At least 8 characters' },
    { key: 'upper', label: 'Uppercase Letter (A-Z)' },
    { key: 'lower', label: 'Lowercase Letter (a-z)' },
    { key: 'number', label: 'Number (0-9)' },
    { key: 'special', label: 'Special Character (!@#$)' }
];

const PasswordCriteria = ({ criteria }) => {
    return (
        <div className="validation-box">
            <p style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', opacity: 0.9 }}>
                Password Requirements:
            </p>
            
            {PASSWORD_RULES.map((rule) => {
                const isValid = criteria[rule.key];
                
                return (
                    <div key={rule.key} className={`validation-item ${isValid ? 'valid' : 'invalid'}`}>
                        {/* Status indicator dot (styles controlled via auth.css) */}
                        <span className={`status-dot ${isValid ? 'valid' : 'invalid'}`}></span>
                        {rule.label}
                    </div>
                );
            })}
        </div>
    );
};

export default PasswordCriteria;