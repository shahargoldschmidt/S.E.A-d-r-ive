/* client/src/components/ProfileModal.js */
import React from 'react';
import '../styles/navbar.css'; // משתמשים באותו קובץ עיצוב

const ProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* לחיצה בתוך החלון לא תסגור אותו */}
            <div className="profile-modal-glass" onClick={e => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={onClose}>✕</button>
                
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {/* אם יש תמונה נציג אותה, אחרת אות ראשונה */}
                        {user.image ? (
                            <img src={user.image} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                    </div>
                    
                    <h2 style={{margin: '10px 0', color: '#0f3460'}}>{user.name}</h2>
                    <div className="profile-badge">Explorer 🌊</div> {/* סתם תוספת חמודה */}
                </div>

                <div className="profile-details-list">
                    <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">User ID</span>
                        <span className="detail-value" style={{fontSize: '0.8rem', opacity: 0.7}}>
                            {localStorage.getItem('userId') || 'Unknown'}
                        </span>
                    </div>
                </div>

                <div className="profile-actions" style={{marginTop: '20px'}}>
                    <button className="btn-primary-sea" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;