/* client/src/components/PermissionsModal.js */
import React, { useState, useEffect } from 'react';
import { addPermission, updatePermission } from '../services/api'; 
import '../styles/modal.css';

const PermissionsModal = ({ isOpen, onClose, onSave, file, currentUser }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('VIEWER');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && file) {
            setCollaborators(file.permissions || []);
            setNewUserEmail('');
            setErrorMsg('');
        }
    }, [isOpen, file]);

    // הוספת משתמש חדש
    const handleAddUser = async () => {
        if (!newUserEmail.trim()) return;
        setIsLoading(true);
        setErrorMsg('');

        try {
            const newPerm = await addPermission(file.id, newUserEmail, newUserRole);
            
            // עדכון הרשימה המקומית
            // השרת מחזיר את אובייקט ההרשאה (עם ID), אנו מוסיפים את האימייל לתצוגה
            const updatedUser = { ...newPerm, email: newUserEmail, role: newUserRole };
            const updatedList = [...collaborators, updatedUser];
            
            setCollaborators(updatedList);
            // עדכון הדשבורד כדי שזה ישתקף מיד
            onSave(file.id, { permissions: updatedList });

            setNewUserEmail('');
        } catch (err) {
            setErrorMsg(err.message || 'Failed to add permission');
        } finally {
            setIsLoading(false);
        }
    };

    // שינוי תפקיד קיים (זה מה שלא עבד לך קודם)
    const handleRoleChange = async (email, newRole) => {
        // מציאת ההרשאה ברשימה כדי לקבל את ה-ID שלה
        const userPerm = collaborators.find(c => c.email === email);
        if (!userPerm || !userPerm.id) {
            console.error("Permission ID not found for user", email);
            setErrorMsg("Cannot update: Missing permission ID");
            return;
        }

        try {
            // קריאה לשרת לעדכון
            await updatePermission(file.id, userPerm.id, newRole);

            // עדכון הסטייט המקומי
            const updatedList = collaborators.map(c => 
                c.email === email ? { ...c, role: newRole, type: newRole } : c
            );
            setCollaborators(updatedList);
            onSave(file.id, { permissions: updatedList });

        } catch (err) {
            console.error("Update role failed", err);
            setErrorMsg("Failed to update role");
        }
    };

    const handleRemoveUser = (email) => {
        // כאן אמורה להיות קריאה ל-deletePermission ב-API אם רוצים למחוק מהשרת מיד
        // כרגע השארתי את הלוגיקה שלך שמסירה רק מהתצוגה
        setCollaborators(prev => prev.filter(c => c.email !== email));
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '550px' }}>
                <h3>🔒 Manage Access</h3>
                <p style={{marginBottom: '20px', fontSize: '0.9rem', color: '#666'}}>
                    File: <strong>{file?.name}</strong>
                </p>

                <div className="permissions-add-section">
                    <input 
                        type="email" 
                        placeholder="Enter user email..." 
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="permission-input"
                    />
                    <select 
                        value={newUserRole} 
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="permission-select"
                    >
                        <option value="VIEWER">Viewer</option>
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button 
                        className="btn-add-user" 
                        onClick={handleAddUser}
                        disabled={isLoading}
                    >
                        {isLoading ? '...' : 'Add'}
                    </button>
                </div>
                
                {errorMsg && <div className="error-bubble-small">{errorMsg}</div>}

                <hr className="divider" />

                <div className="collaborators-list">
                    <h4>People with access</h4>
                    {collaborators.length === 0 && <div style={{opacity: 0.5, fontSize: '0.9rem'}}>No permissions set.</div>}
                    
                    {collaborators.map((user, index) => (
                        <div key={user.email || index} className="collaborator-row">
                            <div className="collab-info">
                                <span className="collab-email">{user.email}</span>
                                {user.email === file.owner && <span className="collab-badge">Owner</span>}
                            </div>
                            <div className="collab-actions">
                                <select 
                                    value={user.role || user.type || 'VIEWER'} 
                                    onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                    className="permission-select-small"
                                    disabled={user.email === file.owner}
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                {user.email !== file.owner && (
                                    <button className="btn-remove-user" onClick={() => handleRemoveUser(user.email)} title="Remove access">✕</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-actions" style={{marginTop: '20px'}}>
                    <button className="btn-create" onClick={handleClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default PermissionsModal;