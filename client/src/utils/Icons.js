/* client/src/utils/Icons.js */
import React from 'react';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

/**
 * Native-ready Icons for S.E.A. D(R)IVE.
 * Replaces Web SVG tags with @expo/vector-icons components.
 */
export const Icons = {
    /* --- Navigation & Sidebar Icons --- */
    Home: (props) => <Feather name="home" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Storage: (props) => <Feather name="cloud" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Folder: (props) => <Feather name="folder" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    File: (props) => <Feather name="file" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    FileText: (props) => <Feather name="file-text" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Image: (props) => <Feather name="image" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    
    Starred: (props) => <Feather name="star" size={props.size || 24} color={props.color || '#f4b400'} {...props} />,
    Star: (props) => <Feather name="star" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Trash: (props) => <Feather name="trash-2" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Delete: (props) => <Feather name="trash" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Shared: (props) => <Feather name="users" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Clock: (props) => <Feather name="clock" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Users: (props) => <Feather name="users" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,

    /* --- Action Icons --- */
    Plus: (props) => <Feather name="plus" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    UploadFile: (props) => <Feather name="upload" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    UploadPhoto: (props) => <Feather name="image" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Camera: (props) => <Feather name="camera" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Search: (props) => <Feather name="search" size={props.size || 18} color={props.color || '#888'} {...props} />,
    MenuDots: (props) => <Feather name="more-vertical" size={props.size || 20} color={props.color || 'currentColor'} {...props} />,
    BackArrow: (props) => <Feather name="arrow-left" size={props.size || 20} color={props.color || 'currentColor'} {...props} />,
    Close: (props) => <Feather name="x" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Rename: (props) => <Feather name="edit" size={props.size || 18} color={props.color || 'currentColor'} {...props} />,
    Save: (props) => <Feather name="save" size={props.size || 22} color={props.color || 'currentColor'} {...props} />,
    Download: (props) => <Feather name="download" size={props.size || 18} color={props.color || 'currentColor'} {...props} />,
    
    /* --- Auth & Permissions Icons --- */
    Eye: (props) => <Feather name="eye" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    EyeOff: (props) => <Feather name="eye-off" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    User: (props) => <Feather name="user" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Lock: (props) => <Feather name="lock" size={props.size || 24} color={props.color || 'currentColor'} {...props} />,
    Logout: (props) => <Feather name="log-out" size={props.size || 20} color={props.color || '#fff'} {...props} />,
    Restore: (props) => <MaterialIcons name="settings-backup-restore" size={props.size || 18} color={props.color || 'currentColor'} {...props} />,

    /* --- Theme Icons --- */
    Sun: (props) => <Feather name="sun" size={props.size || 22} color={props.color || '#FFD700'} {...props} />,
    Moon: (props) => <Feather name="moon" size={props.size || 22} color={props.color || '#444'} {...props} />
};