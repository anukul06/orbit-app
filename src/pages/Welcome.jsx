import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrbitAnimation from '../components/OrbitAnimation';

const features = [
    {
        icon: '🧠',
        title: 'AI Career Recommendation',
        desc: 'Intelligent analysis of your strengths, interests, and market trends to find your ideal career path.',
    },
    {
        icon: '🗺️',
        title: 'Structured Roadmaps',
        desc: 'Week-by-week learning plans with milestones, projects, and curated resources tailored to you.',
    },
    {
        icon: '🔄',
        title: 'Adaptive Feedback Loop',
        desc: 'Real-time behavior insights and personalized adjustments to keep you on the optimal trajectory.',
    },
];

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            {/* Background effects */}
            <div className="bg-grid" />
            <div className="bg-gradient-orb bg-gradient-orb-1" />
            <div className="bg-gradient-orb bg-gradient-orb-2" />

            {/* Navbar */}
            <header style={{
                position: 'relative', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 48px',
            }}>
                <div className="navbar-logo" style={{ fontSize: '1.8rem' }}>ORBIT</div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/login')}>Login</button>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started</button>
                </div>
            </header>

            {/* Hero */}
            <section className="page-container" style={{
                position: 'relative', zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                minHeight: 'calc(100vh - 320px)',
                gap: 64,
            }}>
                {/* Left content */}
                <div style={{ flex: 1, maxWidth: 640, position: 'relative', zIndex: 2 }}>
                    <div className="animate-fade-in" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 16px',
                        background: 'rgba(108, 99, 255, 0.1)',
                        border: '1px solid rgba(108, 99, 255, 0.2)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 500,
                        marginBottom: 24
                    }}>
                        ✨ AI-Powered Adaptive Learning
                    </div>

                    <h1 className="animate-fade-in delay-100" style={{
                        fontSize: '4rem', lineHeight: 1.1, marginBottom: 20,
                        fontWeight: 800
                    }}>
                        From <span className="gradient-text">Confusion</span><br />
                        to <span className="gradient-text">Clarity.</span>
                    </h1>

                    <p className="animate-fade-in delay-200" style={{
                        fontSize: '1.2rem', color: 'var(--text-secondary)',
                        lineHeight: 1.7, marginBottom: 40, maxWidth: 500
                    }}>
                        An adaptive AI system that evolves with your learning journey.
                        Discover your path, build your skills, and track your growth — all in one place.
                    </p>

                    <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: 16 }}>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')} id="get-started-btn">
                            Get Started →
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')} id="login-btn">
                            Login
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="animate-fade-in delay-400" style={{
                        display: 'flex', gap: 48, marginTop: 56,
                        padding: '24px 0', borderTop: '1px solid var(--border-glass)'
                    }}>
                        {[
                            { num: '10K+', label: 'Active Learners' },
                            { num: '95%', label: 'Clarity Rate' },
                            { num: '50+', label: 'Career Paths' },
                        ].map((s, i) => (
                            <div key={i}>
                                <div style={{
                                    fontFamily: 'var(--font-display)', fontSize: '1.5rem',
                                    fontWeight: 800, color: 'var(--text-primary)'
                                }}>{s.num}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side - Orbit Animation */}
                <div style={{
                    flex: '0 0 420px',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <OrbitAnimation />
                </div>
            </section>

            {/* Feature cards */}
            <section className="page-container" style={{
                position: 'relative', zIndex: 1,
                paddingBottom: 80, paddingTop: 20,
            }}>
                <div className="grid grid-3" style={{ gap: 24 }}>
                    {features.map((f, i) => (
                        <div key={i} className={`glass-card animate-slide-up delay-${(i + 4) * 100}`} style={{ padding: 32 }}>
                            <div style={{
                                fontSize: '2.5rem', marginBottom: 16,
                                width: 60, height: 60,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(108, 99, 255, 0.1)',
                                borderRadius: 'var(--radius-md)'
                            }}>{f.icon}</div>
                            <h3 style={{ marginBottom: 12, fontSize: '1.2rem' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
