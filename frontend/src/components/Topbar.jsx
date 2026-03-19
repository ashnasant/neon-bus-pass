import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const { user } = useAuth();
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const res = await api.get(`/notifications/${user.id}`);
                setNotifCount(res.data.filter(n => !n.is_read).length);
            } catch (err) {
                console.error('Failed to fetch notifications');
            }
        };
        fetchNotifs();
    }, [user.id]);

    return (
        <div className="topbar">
            <div className="topbar-title">BusID+ Portal</div>
            <div className="topbar-actions">
                <div className="icon-btn" style={{ position: 'relative', border: 'none', background: 'none' }}>
                    🔔{notifCount > 0 && <div className="notif-dot"></div>}
                </div>
                <div className="user-profile-sm" style={{ fontWeight: 600 }}>
                    {user.name} ({user.role})
                </div>
            </div>
        </div>
    );
};

export default Topbar;
