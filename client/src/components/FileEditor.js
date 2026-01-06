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
    const [isReplacingImage, setIsReplacingImage] = useState(false); // סטייט לטעינת תמונה
    
    const contentRef = useRef(null);
    const imageInputRef = useRef(null); // רפרנס לאינפוט הנסתר

    const isImage = file.type === 'image' || /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file.name);

    useEffect(() => {
        setTitle(file.name || 'Untitled');
        setContent(file.content || '');
        setImageLoadError(false);
        setIsReplacingImage(false);
    }, [file]);

    // --- בדיקת הרשאות ---
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

    // 👇 שינוי 1: ביטלנו את החסימה לתמונות (!isImage נמחק)
    // עכשיו מותר לערוך אם אתה אדמין/עורך, לא משנה איזה סוג קובץ
    const canEdit = (userRole === 'ADMIN' || userRole === 'EDITOR');
    
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

    // 👇 פונקציה חדשה להחלפת תמונה
    const handleImageReplace = async (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;

        setIsReplacingImage(true); // מפעיל אנימציית טעינה

        const reader = new FileReader();
        reader.readAsDataURL(newFile);
        
        reader.onload = () => {
            const fullBase64 = reader.result;
            // ניקוי הכותרת data:image/... כדי לשלוח לשרת נקי
            const cleanContent = fullBase64.split(',')[1];
            
            // עדכון התצוגה מקומית מיד
            setContent(cleanContent);
            
            // שליחה לשמירה בשרת
            onSave(file.id, { content: cleanContent });
            
            setIsReplacingImage(false); // סיום טעינה
        };

        reader.onerror = () => {
            alert("Failed to read file");
            setIsReplacingImage(false);
        };
    };

    // לוגיקה לכפתור העריכה
    const handleEditClick = () => {
        if (isImage && !imageLoadError) {
            // אם זו תמונה - פתח חלון בחירת קובץ
            imageInputRef.current.click();
        } else {
            // אם זה טקסט - כנס למצב עריכה
            setIsEditing(true);
        }
    };

    const actionsToRender = menuActions && menuActions.length > 0 ? menuActions : null;

    const getIcon = () => {
        if (isImage && !imageLoadError) return '🖼️';
        if (imageLoadError) return '⚠️';
        return '📄';
    };

    const getCleanImageSrc = (rawContent) => {
        if (!rawContent) return '';
        let clean = rawContent.replace(/[\s\n\r]/g, '');
        if (clean.startsWith('data:image')) return clean;
        const ext = file.name.split('.').pop().toLowerCase();
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
 
                     {/* 👇 הכפתור החכם: מפעיל לוגיקה שונה לפי הסוג */}
                     {canEdit && !isEditing && (
                         <button className="action-pill-btn" onClick={handleEditClick}>
                             <span>{isImage ? '🔄' : '✏️'}</span> {isImage ? 'Replace Image' : 'Edit'}
                         </button>
                     )}
                     
                     {/* אינפוט נסתר להחלפת תמונה */}
                     <input 
                        type="file" 
                        accept="image/*" 
                        ref={imageInputRef} 
                        style={{display: 'none'}} 
                        onChange={handleImageReplace}
                     />

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
                     <div style={{ 
                         display: 'flex', 
                         justifyContent: 'center', 
                         alignItems: 'center', 
                         height: '100%', 
                         padding: '20px',
                         background: 'rgba(0,0,0,0.03)',
                         borderRadius: '8px',
                         position: 'relative' // בשביל הלואדר
                     }}>
                         {/* 👇 תצוגת לואדר בזמן החלפה */}
                         {isReplacingImage && (
                             <div style={{position:'absolute', zIndex:10, background:'rgba(255,255,255,0.7)', padding:'20px', borderRadius:'10px'}}>
                                 ⏳ Uploading...
                             </div>
                         )}
                         
                         <img 
                             src={getCleanImageSrc(content)} 
                             alt={title} 
                             onError={() => setImageLoadError(true)}
                             style={{ 
                                 maxWidth: '100%', 
                                 maxHeight: '100%', 
                                 objectFit: 'contain', 
                                 borderRadius: '8px', 
                                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                 opacity: isReplacingImage ? 0.5 : 1 // עמעום בזמן החלפה
                             }} 
                         />
                     </div>
                 ) : (
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