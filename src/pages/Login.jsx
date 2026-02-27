import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Email and Password are required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!isLogin) {
            if (!name.trim()) { setError('Full Name is required.'); return; }
            if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        }

        setLoading(true);
        try {
            if (isLogin) {
                await api.login(email, password);
                navigate('/dashboard');
            } else {
                await api.signup(email, password);
                navigate('/complete-profile');
            }
        } catch (err) {
            setError(err.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: 'var(--bg-primary)',
        }}>
            <div className="bg-grid" />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div className="navbar-logo" style={{ fontSize: '2.2rem', marginBottom: 8, cursor: 'pointer' }}
                        onClick={() => navigate('/')}>ORBIT</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
                    </p>
                </div>

                <div className="glass-card" style={{
                    padding: 40, border: '1px solid var(--border-accent)', boxShadow: 'var(--shadow-glow)',
                }}>
                    {error && (
                        <div style={{
                            padding: '10px 14px', background: 'rgba(255, 82, 82, 0.1)',
                            border: '1px solid rgba(255, 82, 82, 0.2)', borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-danger)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 20,
                        }}>⚠ {error}</div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {!isLogin && (
                            <div style={{ marginBottom: 20 }}>
                                <label className="input-label">Full Name</label>
                                <input type="text" className="input-field" placeholder="Enter your full name"
                                    value={name} onChange={e => { setName(e.target.value); setError(''); }}
                                    id="name-input" required />
                            </div>
                        )}

                        <div style={{ marginBottom: 20 }}>
                            <label className="input-label">Email Address</label>
                            <input type="email" className="input-field" placeholder="you@example.com"
                                value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                                id="email-input" required />
                        </div>

                        <div style={{ marginBottom: !isLogin ? 20 : 28 }}>
                            <label className="input-label">Password</label>
                            <input type="password" className="input-field" placeholder="Enter your password"
                                value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                                id="password-input" required minLength={6} />
                        </div>

                        {!isLogin && (
                            <div style={{ marginBottom: 28 }}>
                                <label className="input-label">Confirm Password</label>
                                <input type="password" className="input-field" placeholder="Re-enter your password"
                                    value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                                    id="confirm-password-input" required />
                            </div>
                        )}

                        {isLogin && (
                            <div style={{ textAlign: 'right', marginTop: -16, marginBottom: 20, fontSize: '0.85rem' }}>
                                <a href="#" style={{ color: 'var(--accent-primary)' }}>Forgot password?</a>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary"
                            style={{ width: '100%', padding: '14px 28px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
                            id="submit-btn" disabled={loading}>
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')} {!loading && '→'}
                        </button>
                    </form>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        margin: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem'
                    }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
                        or
                        <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <span onClick={() => { setIsLogin(!isLogin); setError(''); setConfirmPassword(''); }}
                            style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
                            id="toggle-auth">
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
