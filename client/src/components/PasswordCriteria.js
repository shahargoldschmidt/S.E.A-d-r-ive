/* client/src/components/PasswordCriteria.js
 * Component: Displays the list of password requirements.
 * Receives 'criteria' object as a prop to determine green/red status.
 */

import React from 'react';
// We use the same styles from auth.css, so no new import needed if loaded globally.

const PasswordCriteria = ({ criteria }) => {
    return (
        <div className="validation-box">
            <p style={{fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px'}}>
                Password Requirements:
            </p>
            
            {/* Rule 1: Length */}
            <div className={`validation-item ${criteria.length ? 'valid' : 'invalid'}`}>
                <span className="validation-icon">{criteria.length ? '✔' : '✖'}</span> 
                At least 8 characters
            </div>

            {/* Rule 2: Uppercase */}
            <div className={`validation-item ${criteria.upper ? 'valid' : 'invalid'}`}>
                <span className="validation-icon">{criteria.upper ? '✔' : '✖'}</span> 
                Uppercase Letter (A-Z)
            </div>

            {/* Rule 3: Lowercase */}
            <div className={`validation-item ${criteria.lower ? 'valid' : 'invalid'}`}>
                <span className="validation-icon">{criteria.lower ? '✔' : '✖'}</span> 
                Lowercase Letter (a-z)
            </div>

            {/* Rule 4: Number */}
            <div className={`validation-item ${criteria.number ? 'valid' : 'invalid'}`}>
                <span className="validation-icon">{criteria.number ? '✔' : '✖'}</span> 
                Number (0-9)
            </div>

            {/* Rule 5: Special Char */}
            <div className={`validation-item ${criteria.special ? 'valid' : 'invalid'}`}>
                <span className="validation-icon">{criteria.special ? '✔' : '✖'}</span> 
                Special Character (!@#$)
            </div>
        </div>
    );
};

export default PasswordCriteria;