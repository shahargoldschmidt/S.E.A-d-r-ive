/* client/src/components/PermissionsModal.js */
import React, { useState, useEffect } from 'react';
import { addPermission, updatePermission, getPermissions, removePermission } from '../services/api'; 
import '../styles/modal.css';

const PermissionsModal = ({ isOpen, onClose, onSave, file, currentUser }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('VIEWER');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && file) {
            loadPermissions();
            setNewUserEmail('');
            setErrorMsg('');
        }
    }, [isOpen, file]);

    const loadPermissions = async () => {
        setIsLoading(true);
        try {
            const perms = await getPermissions(file.id);
            setCollaborators(perms);
        } catch (error) {
            setCollaborators(file.permissions || []);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!newUserEmail.trim()) return false;
        setIsLoading(true);
        setErrorMsg('');

        try {
            const newPerm = await addPermission(file.id, newUserEmail, newUserRole);
            const updatedUser = { ...newPerm, email: newUserEmail, role: newUserRole };
            setCollaborators(prev => [...prev, updatedUser]);
            onSave(file.id, { permissions: [...collaborators, updatedUser] });
            setNewUserEmail('');
            return true;
        } catch (err) {
            setErrorMsg(err.message || 'Failed to add permission');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSmartAction = async () => {
        if (newUserEmail.trim().length > 0) {
            const success = await handleAddUser();
            if (success) onClose();
        } else {
            onClose();
        }
    };

    const handleRemoveUser = async (email) => {
        const userPerm = collaborators.find(c => c.email === email);
        if (!userPerm || !userPerm.id) return;
        try {
            await removePermission(file.id, userPerm.id);
            setCollaborators(prev => prev.filter(c => c.email !== email));
        } catch (error) { setErrorMsg("Failed to remove user"); }
    };
    
    // ...handleRoleChange... (אותו דבר כמו קודם)
    const handleRoleChange = async (email, newRole) => {
        const userPerm = collaborators.find(c => c.email === email);
        if (!userPerm || !userPerm.id) return;
        try {
            await updatePermission(file.id, userPerm.id, newRole);
            const updatedList = collaborators.map(c => 
                c.email === email ? { ...c, role: newRole, type: newRole } : c
            );
            setCollaborators(updatedList);
            onSave(file.id, { permissions: updatedList });
        } catch (err) { setErrorMsg("Failed to update role"); }
    };


    if (!isOpen) return null;
    const hasUnsavedInput = newUserEmail.trim().length > 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>🔒 Manage Access</h3>
                
                {/* זו הקפסולה היפה שתוקנה */}
                <div className="permissions-bar">
                    <input 
                        type="email" 
                        placeholder="Enter user email..." 
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                    <div style={{width:'1px', height:'20px', background:'#cbd5e1', margin:'0 5px'}}></div>
                    <select 
                        value={newUserRole} 
                        onChange={(e) => setNewUserRole(e.target.value)}
                    >
                        <option value="VIEWER">Viewer</option>
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button className="btn-add" onClick={handleAddUser} disabled={isLoading}>
                        {isLoading ? '...' : 'Add'}
                    </button>
                </div>
                
                {errorMsg && <div style={{color: '#ef4444', marginBottom: '10px', textAlign:'center'}}>⚠️ {errorMsg}</div>}

                <div className="collab-list">
                    <div style={{fontSize:'0.85rem', color:'#64748b', fontWeight:'bold', marginBottom:'10px', textTransform:'uppercase'}}>People with access</div>
                    {collaborators.map((user, index) => (
                        <div key={user.id || index} className="collab-row">
                             <div style={{display:'flex', alignItems:'center'}}>
                                <span style={{fontWeight:'500'}}>{user.email}</span>
                                {user.email === file.owner && <span style={{background:'rgba(14,165,233,0.1)', color:'#0ea5e9', fontSize:'0.7rem', padding:'2px 6px', borderRadius:'4px', marginLeft:'8px', fontWeight:'bold'}}>OWNER</span>}
                            </div>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <select 
                                    value={user.role || user.type || 'VIEWER'} 
                                    onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                    style={{padding:'4px', fontSize:'0.9rem', width:'auto', border:'none', background:'transparent', fontWeight:'600', cursor:'pointer'}}
                                    disabled={user.email === file.owner}
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                {user.email !== file.owner && (
                                    <button onClick={() => handleRemoveUser(user.email)} style={{border:'none', background:'transparent', color:'#94a3b8', cursor:'pointer', fontSize:'1.2rem', marginLeft:'5px'}}>✕</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="btn-primary" onClick={handleSmartAction}>
                        {hasUnsavedInput ? "Add & Save" : "Done"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermissionsModal;