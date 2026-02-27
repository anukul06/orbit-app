import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/' || location.pathname === '/login';

    if (isAuthPage) return null;

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-logo">ORBIT</div>
                <div className="navbar-links">
                    <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        🏠 Home
                    </NavLink>
                    <NavLink to="/stream-dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        🗺️ Roadmap
                    </NavLink>
                    <NavLink to="/stream-dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        ✅ Tasks
                    </NavLink>
                    <NavLink to="/insights" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        📊 Insights
                    </NavLink>
                    <NavLink to="/dashboard" className="navbar-link">
                        👤 Profile
                    </NavLink>
                </div>
                <div className="navbar-profile" title="Profile">A</div>
            </div>
        </nav>
    );
}
