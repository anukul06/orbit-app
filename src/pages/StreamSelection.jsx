import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const streams = [
    {
        icon: '🤖',
        name: 'Artificial Intelligence',
        desc: 'Build intelligent systems — from neural networks to natural language processing and computer vision.',
        difficulty: 'Hard',
        futureFit: 92,
    },
    {
        icon: '📊',
        name: 'Data Science',
        desc: 'Extract insights from data using statistics, visualization, and machine learning techniques.',
        difficulty: 'Medium',
        futureFit: 88,
    },
    {
        icon: '🧠',
        name: 'Machine Learning',
        desc: 'Design algorithms that learn from data — supervised, unsupervised, and reinforcement learning.',
        difficulty: 'Hard',
        futureFit: 90,
    },
    {
        icon: '🌐',
        name: 'Web Development',
        desc: 'Create modern web applications with cutting-edge frameworks, APIs, and deployment strategies.',
        difficulty: 'Easy',
        futureFit: 78,
    },
    {
        icon: '🔒',
        name: 'Cybersecurity',
        desc: 'Protect systems and networks from threats. Learn ethical hacking, cryptography, and defense.',
        difficulty: 'Medium',
        futureFit: 85,
    },
];

export default function StreamSelection() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const handleSelect = (index) => {
        setSelected(index);
    };

    const handleContinue = () => {
        if (selected !== null) {
            navigate('/stream-dashboard');
        }
    };

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
                {/* Header */}
                <div className="animate-fade-in" style={{ marginBottom: 40 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 14px',
                        background: 'rgba(108, 99, 255, 0.1)',
                        border: '1px solid rgba(108, 99, 255, 0.2)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 500,
                        marginBottom: 16
                    }}>
                        💻 Computer Science
                    </div>
                    <h2 style={{ marginBottom: 8 }}>Choose Your <span className="gradient-text">Stream</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 600 }}>
                        Select a specialization to get a personalized roadmap, resources, and AI-driven guidance.
                    </p>
                </div>

                {/* Stream Cards */}
                <div className="grid" style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: 24,
                    marginBottom: 40,
                }}>
                    {streams.map((stream, i) => (
                        <div
                            key={i}
                            className={`glass-card animate-slide-up delay-${(i + 1) * 100}`}
                            style={{
                                padding: 28,
                                cursor: 'pointer',
                                border: selected === i ? '1.5px solid var(--accent-primary)' : undefined,
                                boxShadow: selected === i ? 'var(--shadow-glow), inset 0 0 40px rgba(108, 99, 255, 0.05)' : undefined,
                                background: selected === i ? 'rgba(108, 99, 255, 0.08)' : undefined,
                                position: 'relative',
                            }}
                            onClick={() => handleSelect(i)}
                            id={`stream-${stream.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            {selected === i && (
                                <div style={{
                                    position: 'absolute', top: 16, right: 16,
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: 'var(--accent-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.85rem', color: 'white', fontWeight: 700,
                                }}>✓</div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                                <div style={{
                                    fontSize: '1.6rem',
                                    width: 44, height: 44,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(108, 99, 255, 0.1)',
                                    borderRadius: 'var(--radius-md)',
                                }}>{stream.icon}</div>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: 2 }}>{stream.name}</h4>
                                    <span className={`badge badge-${stream.difficulty.toLowerCase() === 'easy' ? 'easy' : stream.difficulty.toLowerCase() === 'medium' ? 'medium' : 'hard'}`}>
                                        {stream.difficulty}
                                    </span>
                                </div>
                            </div>

                            <p style={{
                                color: 'var(--text-secondary)', fontSize: '0.92rem',
                                lineHeight: 1.6, marginBottom: 20,
                            }}>{stream.desc}</p>

                            {/* Future Fit Score */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    marginBottom: 8, fontSize: '0.85rem'
                                }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Future Fit Score</span>
                                    <span style={{ fontWeight: 600 }} className="gradient-text">{stream.futureFit}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-bar-fill" style={{ width: `${stream.futureFit}%` }} />
                                </div>
                            </div>

                            <button
                                className={`btn ${selected === i ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                style={{ width: '100%' }}
                                onClick={(e) => { e.stopPropagation(); handleSelect(i); }}
                            >
                                {selected === i ? 'Selected ✓' : 'Select Stream'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Continue Button */}
                {selected !== null && (
                    <div className="animate-fade-in" style={{
                        display: 'flex', justifyContent: 'center', gap: 16,
                        padding: '24px 0',
                    }}>
                        <button className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>
                            ← Back
                        </button>
                        <button className="btn btn-primary btn-lg" onClick={handleContinue} id="continue-btn">
                            Continue with {streams[selected].name} →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
