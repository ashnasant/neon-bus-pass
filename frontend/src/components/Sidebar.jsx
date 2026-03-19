import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = {
        admin: [
            { path: '/dashboard', icon: '📊', label: 'Dashboard' },
            { path: '/applications', icon: '📝', label: 'Applications' },
            { path: '/routes', icon: '🛣️', label: 'Manage Routes' },
            { path: '/users', icon: '👥', label: 'Manage Users' },
            { path: '/verify', icon: '🔍', label: 'Verify Pass' },
            { path: '/settings', icon: '⚙️', label: 'Settings' },
        ],
        student: [
            { path: '/dashboard', icon: '📊', label: 'Dashboard' },
            { path: '/apply', icon: '📋', label: 'Apply for Pass' },
            { path: '/passes', icon: '🎫', label: 'My Pass' },
            { path: '/settings', icon: '⚙️', label: 'Settings' },
        ],
        verifier: [
            { path: '/verify', icon: '🔍', label: 'Verify Pass' },
        ]
    };

    const items = navItems[user.role] || [];

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="4" y="9" width="16" height="11" rx="2"/><path d="M8 2h8a2 2 0 0 1 2 2v5H6V4a2 2 0 0 1 2-2z"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="M11 2v5"/><path d="M13 2v5"/>
                    </svg>
                </div>
                <div className="logo-text">BusID<span>+</span></div>
            </div>
            <nav className="nav-section">
                {items.map(item => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer', color: '#dc3545' }}>
                    <span className="nav-icon">🚪</span>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
