import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const hiddenRoutes = ['/', '/login', '/complete-profile'];
    const isHidden = hiddenRoutes.includes(location.pathname);

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
