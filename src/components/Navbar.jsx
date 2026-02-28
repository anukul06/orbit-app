import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const hiddenRoutes = ['/', '/login', '/complete-profile'];
    const isHidden = hiddenRoutes.includes(location.pathname);
    const [pendingCount, setPendingCount] = useState(0);

    // Fetch pending task count for bell badge
    useEffect(() => {
        if (isHidden) return;
        api.getPendingTasks().then(d => setPendingCount(d.count || 0)).catch(() => { });
        const interval = setInterval(() => {
            api.getPendingTasks().then(d => setPendingCount(d.count || 0)).catch(() => { });
        }, 60000);
        return () => clearInterval(interval);
    }, [location.pathname]);

    if (isHidden) return null;

    const handleLogout = async () => {
        try { await api.logout(); } catch { }
        navigate('/login');
    };

    const links = [
        { to: '/dashboard', icon: '🏠', label: 'Home' },
        { to: '/roadmap', icon: '🗺️', label: 'Roadmap' },
        { to: '/tasks', icon: '✅', label: 'Tasks' },
        { to: '/insights', icon: '📊', label: 'Insights' },
        { to: '/skill-progress', icon: '📈', label: 'Skills' },
        { to: '/community', icon: '🧑‍🤝‍🧑', label: 'Community' },
        { to: '/profile', icon: '👤', label: 'Profile' },
        { to: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>ORBIT</div>
                <div className="navbar-links">
                    {links.map(link => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                            {link.icon} {link.label}
                        </NavLink>
                    ))}

                    {/* Bell icon with pending count badge */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: 4 }}
                        title={pendingCount > 0 ? `${pendingCount} pending tasks` : 'No pending tasks'}>
                        <span style={{ fontSize: '1.1rem', cursor: 'pointer', opacity: pendingCount > 0 ? 1 : 0.4 }}
                            onClick={() => navigate('/tasks')}>
                            🔔
                        </span>
                        {pendingCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -6, right: -8,
                                minWidth: 16, height: 16, borderRadius: 8,
                                background: '#ff5252', color: 'white',
                                fontSize: '0.65rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '0 4px',
                                boxShadow: '0 0 6px rgba(255,82,82,0.5)',
                            }}>{pendingCount}</span>
                        )}
                    </div>

                    <button onClick={handleLogout} className="navbar-link" style={{
                        background: 'none', color: 'var(--text-secondary)',
                    }}>
                        🚪 Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
