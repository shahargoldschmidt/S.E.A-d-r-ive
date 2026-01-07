/* client/src/components/FileEditor.js */
import React, { useState, useRef, useEffect } from 'react';
import ActionMenu from './ActionMenu'; 
import { Icons } from '../utils/Icons'; 
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
    const [isReplacingImage, setIsReplacingImage] = useState(false); 
    
    const contentRef = useRef(null);
    const imageInputRef = useRef(null); 

    /* Check if the file is an image based on its type or extension */
    const isImage = file.type === 'image' || /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file.name);

    useEffect(() => {
        setTitle(file.name || 'Untitled');
        setContent(file.content || '');
        setImageLoadError(false);
        setIsReplacingImage(false);
    }, [file]);

    /* Determine user permissions based on ownership or permission array */
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

    const canEdit = (userRole === 'ADMIN' || userRole === 'EDITOR');
    
    /* Utility for rich text editing commands */
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

    /* Handle image replacement by converting the new file to base64 */
    const handleImageReplace = async (e) => {
        const newFile = e.target.files[0];
        if (!newFile) return;

        setIsReplacingImage(true);

        const reader = new FileReader();
        reader.readAsDataURL(newFile);
        
        reader.onload = () => {
            const fullBase64 = reader.result;
            const cleanContent = fullBase64.split(',')[1];
            setContent(cleanContent);
            onSave(file.id, { content: cleanContent });
            setIsReplacingImage(false);
        };

        reader.onerror = () => {
            console.error("Failed to read image file");
            setIsReplacingImage(false);
        };
    };

    const handleEditClick = () => {
        if (isImage && !imageLoadError) {
            imageInputRef.current.click();
        } else {
            setIsEditing(true);
        }
    };

    const getFileIcon = () => {
        if (imageLoadError) return <span style={{color: '#e74c3c'}}>⚠️</span>;
        if (isImage) return <Icons.Image size={30} color="#4facfe" />;
        return <Icons.FileText size={30} color="#64748b" />;
    };

    /* Format raw base64 content into a proper data URL for image src */
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
                         <Icons.BackArrow size={20} />
                     </button>
                     {isEditing ? (
                         <input 
                            type="text" 
                            className="title-input-edit" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            style={{marginLeft: '15px'}} 
                        />
                     ) : (
                         <h2 className="file-title-display" style={{marginLeft: '15px', display:'flex', alignItems:'center', gap:'10px'}}>
                             {getFileIcon()} {title}
                         </h2>
                     )}
                 </div>
 
                 <div className="header-actions">
                     <button 
                        className="action-icon-btn star" 
                        onClick={onToggleStar} 
                        style={{ color: isStarred ? '#f4b400' : 'inherit' }} 
                        title={isStarred ? "Unstar" : "Star"}
                    >
                         <Icons.Star filled={isStarred} size={22} />
                     </button>
 
                     {canEdit && !isEditing && (
                         <button className="action-pill-btn" onClick={handleEditClick}>
                             {isImage ? <Icons.Camera size={22} /> : <Icons.Rename size={22} />}
                             <span>{isImage ? 'Replace Image' : 'Edit'}</span>
                         </button>
                     )}
                     
                     <input 
                        type="file" 
                        accept="image/*" 
                        ref={imageInputRef} 
                        style={{display: 'none'}} 
                        onChange={handleImageReplace}
                     />

                     {isEditing && (
                         <>
                             <button className="action-pill-btn save" onClick={handleSave}>
                                 <Icons.Save size={22} /> Save
                             </button>
                             <button className="action-pill-btn cancel" onClick={() => { setIsEditing(false); setContent(file.content || ''); }}>
                                 <Icons.Close size={22} /> Cancel
                             </button>
                         </>
                     )}
 
                     {menuActions && menuActions.length > 0 && (
                         <div style={{marginLeft: '10px'}}>
                             <ActionMenu actions={menuActions} />
                         </div>
                     )}
                 </div>
             </div>
 
             {/* Toolbar only visible during text editing */}
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
                     <div className="image-display-box">
                         {isReplacingImage && (
                             <div className="upload-overlay">
                                 <span>Updating image...</span>
                             </div>
                         )}
                         
                         <img 
                             src={getCleanImageSrc(content)} 
                             alt={title} 
                             onError={() => setImageLoadError(true)}
                             style={{ opacity: isReplacingImage ? 0.5 : 1 }} 
                         />
                     </div>
                 ) : (
                     <div className="text-editor-box">
                         {imageLoadError && (
                             <div className="error-alert">
                                 <b>Preview Unavailable:</b> This file contains data that cannot be rendered as an image.
                             </div>
                         )}
                         
                         {(!content && !isEditing) ? (
                             <div className="empty-state-message">
                                 <p>This file is empty.</p>
                             </div>
                         ) : (
                             /* dangerouslySetInnerHTML used to render stored HTML content */
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