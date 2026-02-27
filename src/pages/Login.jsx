import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
        }}>
            <div className="bg-grid" />
            <div className="bg-gradient-orb bg-gradient-orb-1" />
            <div className="bg-gradient-orb bg-gradient-orb-2" />

            <div className="animate-scale-in" style={{
                position: 'relative', zIndex: 1, width: '100%', maxWidth: 440,
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div className="navbar-logo" style={{ fontSize: '2.2rem', marginBottom: 8, cursor: 'pointer' }}
                        onClick={() => navigate('/')}>ORBIT</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{
                    padding: 40,
                    border: '1px solid var(--border-accent)',
                    boxShadow: 'var(--shadow-glow)',
                }}>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div style={{ marginBottom: 20 }}>
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    id="name-input"
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: 20 }}>
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                id="email-input"
                            />
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                id="password-input"
                            />
                        </div>

                        {isLogin && (
                            <div style={{
                                textAlign: 'right', marginTop: -16, marginBottom: 20,
                                fontSize: '0.85rem'
                            }}>
                                <a href="#" style={{ color: 'var(--accent-primary)' }}>Forgot password?</a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '14px 28px', fontSize: '1rem' }}
                            id="submit-btn"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'} →
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        margin: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem'
                    }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
                        or
                        <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
                    </div>

                    {/* Toggle */}
                    <div style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <span
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
                            id="toggle-auth"
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
