/* client/src/components/FileEditor.js */
import React, { useState, useRef } from 'react'; // <--- הנה השורה שהייתה חסרה!
import '../styles/editor.css';

const FileEditor = ({ file, onBack, onSave, onDelete, onMove, currentUser }) => {
    const [title, setTitle] = useState(file.name || 'Untitled');
    const [content, setContent] = useState(file.content || ''); 
    const [isEditing, setIsEditing] = useState(false);
    const contentRef = useRef(null);

    // --- לוגיקה לבדיקת הרשאות ---
    const currentUserId = currentUser ? String(currentUser.id) : null;
    const currentUserName = currentUser ? currentUser.name : null;
    const currentUserEmail = currentUser ? currentUser.email : null;

    const fileOwner = file.owner;
    const fileUserId = file.userId ? String(file.userId) : null;

    // בדיקה: האם אני הבעלים לפי ID, לפי שם, או לפי אימייל?
    const isOwner = 
        (fileUserId === currentUserId) || 
        (fileOwner === currentUserName) || 
        (fileOwner === currentUserEmail);

    const canEdit = isOwner || !fileOwner;

    // דיבאג (אפשר למחוק אחר כך)
    console.log("DEBUG PERMISSIONS:", {
        FileOwner: fileOwner,
        MyEmail: currentUserEmail,
        MyName: currentUserName,
        MATCH: canEdit
    });

    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const handleSave = () => {
        if (contentRef.current) {
            onSave(file.id, { 
                name: title, 
                content: contentRef.current.innerHTML 
            });
            setIsEditing(false);
        }
    };

    return (
        <div className="file-editor-container fade-in">
            <div className="editor-header">
                <div className="header-left">
                    <button className="back-btn" onClick={onBack} title="Back">←</button>
                    {isEditing ? (
                        <input type="text" className="title-input-edit" value={title} onChange={(e) => setTitle(e.target.value)} />
                    ) : (
                        <h2 className="file-title-display">{title}</h2>
                    )}
                </div>

                <div className="header-actions">
                    {canEdit && <button className="action-icon-btn" onClick={() => onMove(file)} title="Organize">📂</button>}
                    {canEdit && !isEditing && <button className="action-icon-btn" onClick={() => setIsEditing(true)} title="Edit">✏️</button>}
                    
                    {isEditing && (
                        <>
                            <button className="action-icon-btn save" onClick={handleSave} title="Save">💾</button>
                            <button className="action-icon-btn cancel" onClick={() => setIsEditing(false)} title="Cancel">✕</button>
                        </>
                    )}

                    <button className="action-icon-btn" onClick={() => alert("Permissions")} title="Permissions">🔒</button>
                    <button className="action-icon-btn star" title="Star">⭐</button>
                    
                    {canEdit && <button className="action-icon-btn danger" onClick={() => onDelete(file)} title="Delete">🗑️</button>}
                </div>
            </div>

            {isEditing && (
                <div className="editor-toolbar">
                    <button onMouseDown={(e) => {e.preventDefault(); execCmd('bold');}}><b>B</b></button>
                    <button onMouseDown={(e) => {e.preventDefault(); execCmd('italic');}}><i>I</i></button>
                    <button onMouseDown={(e) => {e.preventDefault(); execCmd('underline');}}><u>U</u></button>
                    <span className="separator">|</span>
                    <input type="color" onChange={(e) => execCmd('foreColor', e.target.value)} />
                </div>
            )}

            <div 
                className={`editor-content ${isEditing ? 'editable' : ''}`}
                contentEditable={isEditing}
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: content }}
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

export default FileEditor;