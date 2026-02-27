import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const hiddenRoutes = ['/', '/login', '/complete-profile'];
    const isHidden = hiddenRoutes.includes(location.pathname);

    if (isHidden) return null;

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>ORBIT</div>
                <div className="navbar-links">
                    <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        🏠 Home
                    </NavLink>
                    <NavLink to="/roadmap" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        🗺️ Roadmap
                    </NavLink>
                    <NavLink to="/tasks" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        ✅ Tasks
                    </NavLink>
                    <NavLink to="/insights" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        📊 Insights
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        👤 Profile
                    </NavLink>
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
