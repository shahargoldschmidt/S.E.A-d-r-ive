/* client/src/components/FileEditor.js */
import React, { useState, useRef, useEffect } from 'react';
import ActionMenu from './ActionMenu'; 
import '../styles/editor.css';
import '../styles/actionMenu.css'; 

const FileEditor = ({ 
    file, 
    onBack, 
    onSave, 
    currentUser, 
    onToggleStar, 
    isStarred,
    menuActions 
}) => {
    const [title, setTitle] = useState(file.name || 'Untitled');
    const [content, setContent] = useState(file.content || ''); 
    const [isEditing, setIsEditing] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    
    const contentRef = useRef(null);

    // זיהוי אם הקובץ הוא תמונה
    const isImage = file.type === 'image' || /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file.name);

    useEffect(() => {
        setTitle(file.name || 'Untitled');
        setContent(file.content || '');
        setImageLoadError(false); // איפוס שגיאה כשמחליפים קובץ
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
    const canEdit = (userRole === 'ADMIN' || userRole === 'EDITOR') && (!isImage || imageLoadError);
    
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

    const getIcon = () => {
        if (isImage && !imageLoadError) return '🖼️';
        if (imageLoadError) return '⚠️'; // אייקון אזהרה אם התמונה שבורה
        return '📄';
    };
    // היא לוקחת את הסטרינג מהשרת והופכת אותו לתמונה תקינה
    const getCleanImageSrc = (rawContent) => {
        if (!rawContent) return '';
        
        // 1. מחיקת רווחים וירידות שורה ששוברות את התמונה
        let clean = rawContent.replace(/[\s\n\r]/g, '');
        
        // 2. אם יש כבר קידומת, מחזירים כמו שזה
        if (clean.startsWith('data:image')) return clean;

        // 3. אם אין קידומת, בונים אותה לבד
        const ext = file.name.split('.').pop().toLowerCase();
        // מנסים לנחש סוג, ברירת מחדל png
        const mimeType = ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : 'png';
        
        return `data:image/${mimeType};base64,${clean}`;
    };
    
    return (
         <div className="file-editor-container fade-in">
             <div className="editor-header">
                 <div className="header-left">
                     <button className="back-circle-btn" onClick={onBack} title="Back">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                     </button>
                     {isEditing ? (
                         <input type="text" className="title-input-edit" value={title} onChange={(e) => setTitle(e.target.value)} style={{marginLeft: '15px'}} />
                     ) : (
                         <h2 className="file-title-display" style={{marginLeft: '15px', display:'flex', alignItems:'center', gap:'8px'}}>
                             {getIcon()} {title}
                         </h2>
                     )}
                 </div>
 
                 <div className="header-actions">
                     <button className="action-icon-btn star" onClick={onToggleStar} style={{ color: isStarred ? '#f4b400' : 'inherit' }} title={isStarred ? "Unstar" : "Star"}>
                         {isStarred ? '★' : '☆'}
                     </button>
 
                     {/* אין כפתור הורדה - רק עריכה לטקסט */}
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
 
             {/* סרגל כלים - רק אם זה טקסט */}
             {isEditing && (!isImage || imageLoadError) && (
                 <div className="editor-toolbar">
                     <button onMouseDown={(e) => {e.preventDefault(); execCmd('bold');}}><b>B</b></button>
                     <button onMouseDown={(e) => {e.preventDefault(); execCmd('italic');}}><i>I</i></button>
                     <button onMouseDown={(e) => {e.preventDefault(); execCmd('underline');}}><u>U</u></button>
                     <span className="separator">|</span>
                     <input type="color" onChange={(e) => execCmd('foreColor', e.target.value)} />
                 </div>
             )}
 
             <div className="editor-content-wrapper">
                 {isImage && !imageLoadError ? (
                     // === כאן התמונה מוצגת ===
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
                             // השימוש בפונקציית הניקוי הוא הקריטי כאן
                             src={getCleanImageSrc(content)} 
                             alt={title} 
                             onError={() => setImageLoadError(true)}
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
                     // === תצוגת טקסט רגילה ===
                     <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                         {imageLoadError && (
                             <div style={{
                                 padding: '10px', 
                                 background: '#fff3cd', 
                                 color: '#856404', 
                                 borderRadius: '8px', 
                                 marginBottom: '15px',
                                 fontSize: '0.9rem'
                             }}>
                                 ⚠️ <b>תצוגה לא זמינה:</b> הקובץ מכיל מידע שלא ניתן להציג כתמונה.
                             </div>
                         )}
                         
                         {(!content && !isEditing) ? (
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
                         )}
                     </div>
                 )}
             </div>
         </div>
     );
 };
 export default FileEditor;