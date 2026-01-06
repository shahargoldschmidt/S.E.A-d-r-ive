/* client/src/components/FileEditor.js */
import React, { useState, useRef, useEffect } from 'react';
import ActionMenu from './ActionMenu'; 
import '../styles/editor.css';
import '../styles/actionMenu.css'; 

const FileEditor = ({ 
    file, 
    onBack, 
    onSave, 
    onDelete, 
    onMove, 
    currentUser, 
    onToggleStar, 
    isStarred,
    menuActions 
}) => {
    const [title, setTitle] = useState(file.name || 'Untitled');
    const [content, setContent] = useState(file.content || ''); 
    const [isEditing, setIsEditing] = useState(false);
    const contentRef = useRef(null);

    // זיהוי אם הקובץ הוא תמונה
    const isImage = file.type === 'image';

    useEffect(() => {
        setTitle(file.name || 'Untitled');
        setContent(file.content || '');
    }, [file]);

    // --- בדיקת הרשאות פנימית ---
    let userRole = 'none';

    if (currentUser) {
        const currentUserId = String(currentUser.id);
        const currentUserEmail = currentUser.email;
        const fileOwner = String(file.owner);
        const fileUserId = file.userId ? String(file.userId) : null;

        if (fileOwner === currentUserEmail || fileOwner === currentUserId || fileUserId === currentUserId) {
            userRole = 'ADMIN';
        } else if (file.permissions && Array.isArray(file.permissions)) {
            const perm = file.permissions.find(p => 
                p.email === currentUserEmail || String(p.userId) === currentUserId
            );
            if (perm) userRole = perm.type; 
        }
    }

    // תנאי להצגת כפתור עריכה: (רק למנהלים/עורכים) וגם (רק אם זו לא תמונה)
    const canEdit = (userRole === 'ADMIN' || userRole === 'EDITOR') && !isImage;
    
    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const handleSave = () => {
        if (contentRef.current) {
            const newContent = contentRef.current.innerHTML;
            setContent(newContent); 
            onSave(file.id, { name: title, content: newContent });
            setIsEditing(false);
        }
    };

    const actionsToRender = menuActions && menuActions.length > 0 ? menuActions : null;

    return (
        <div className="file-editor-container fade-in">
            <div className="editor-header">
                <div className="header-left">
                    <button className="back-circle-btn" onClick={onBack} title="Back">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    {/* עריכת כותרת רק אם זה לא תמונה ובמצב עריכה */}
                    {isEditing ? (
                        <input type="text" className="title-input-edit" value={title} onChange={(e) => setTitle(e.target.value)} style={{marginLeft: '15px'}} />
                    ) : (
                        <h2 className="file-title-display" style={{marginLeft: '15px', display:'flex', alignItems:'center', gap:'8px'}}>
                            {isImage ? '🖼️' : '📄'} {title}
                        </h2>
                    )}
                </div>

                <div className="header-actions">
                    <button className="action-icon-btn star" onClick={onToggleStar} style={{ color: isStarred ? '#f4b400' : 'inherit' }} title={isStarred ? "Unstar" : "Star"}>
                        {isStarred ? '★' : '☆'}
                    </button>

                    {/* כפתור עריכה - מופיע רק אם מותר לערוך וזו לא תמונה */}
                    {canEdit && !isEditing && (
                        <button className="action-pill-btn" onClick={() => setIsEditing(true)}><span>✏️</span> Edit</button>
                    )}
                    
                    {isEditing && (
                        <>
                            <button className="action-pill-btn save" onClick={handleSave}><span>💾</span> Save</button>
                            <button className="action-pill-btn cancel" onClick={() => { setIsEditing(false); setContent(file.content || ''); }}><span>✕</span> Cancel</button>
                        </>
                    )}

                    {actionsToRender && (
                        <div style={{marginLeft: '10px'}}>
                            <ActionMenu actions={actionsToRender} />
                        </div>
                    )}
                </div>
            </div>

            {/* סרגל כלים - רק אם זה טקסט ובמצב עריכה */}
            {isEditing && !isImage && (
                <div className="editor-toolbar">
                    <button onMouseDown={(e) => {e.preventDefault(); execCmd('bold');}}><b>B</b></button>
                    <button onMouseDown={(e) => {e.preventDefault(); execCmd('italic');}}><i>I</i></button>
                    <button onMouseDown={(e) => {e.preventDefault(); execCmd('underline');}}><u>U</u></button>
                    <span className="separator">|</span>
                    <input type="color" onChange={(e) => execCmd('foreColor', e.target.value)} />
                </div>
            )}

            <div className="editor-content-wrapper">
                {isImage ? (
                    // --- תצוגת תמונה ---
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%', 
                        padding: '20px',
                        background: 'rgba(0,0,0,0.03)',
                        borderRadius: '8px'
                    }}>
                        <img 
                            src={content} 
                            alt={title} 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '100%', 
                                objectFit: 'contain', 
                                borderRadius: '8px', 
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                            }} 
                        />
                    </div>
                ) : (
                    // --- תצוגת טקסט רגילה (הקוד הקיים שלך) ---
                    (!content && !isEditing) ? (
                        <div className="empty-state-message">
                            <p>📄 This file is empty.</p>
                        </div>
                    ) : (
                        <div 
                            className={`editor-content ${isEditing ? 'editable' : 'read-only'}`} 
                            contentEditable={isEditing} 
                            ref={contentRef} 
                            dangerouslySetInnerHTML={{ __html: content }} 
                            suppressContentEditableWarning={true} 
                        />
                    )
                )}
            </div>
        </div>
    );
};
export default FileEditor;