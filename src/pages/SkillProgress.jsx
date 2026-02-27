import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const streamSkills = {
    'AI': ['Python', 'Linear Algebra', 'ML Algorithms', 'TensorFlow', 'Data Processing', 'Neural Networks'],
    'Data Science': ['Python', 'SQL', 'Pandas', 'Statistics', 'Data Viz', 'Scikit-learn'],
    'Web Development': ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'REST APIs', 'Git'],
    'Machine Learning': ['Python', 'Mathematics', 'Supervised Learning', 'Deep Learning', 'Model Evaluation', 'Feature Engineering'],
    'Cybersecurity': ['Networking', 'Linux', 'Cryptography', 'Pen Testing', 'Firewalls', 'OWASP'],
    'default': ['Core Concepts', 'Problem Solving', 'Research', 'Communication', 'Project Work', 'Consistency'],
};

const skillColors = ['#6c63ff', '#00e676', '#00d4ff', '#ffab40', '#ff6b9d', '#a78bfa'];

export default function SkillProgress() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getDashboard(), api.getStats()])
            .then(([dash, stats]) => setData({ ...dash, ...stats }))
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading skills...</p>
            </div>
        );
    }

    const substream = data.user?.substream || '';
    const skills = streamSkills[substream] || streamSkills['default'];
    const completionBase = data.tasks_total > 0 ? Math.round(data.tasks_done / data.tasks_total * 100) : 20;

    // Generate skill levels from task completion
    const skillData = skills.map((name, i) => {
        const jitter = Math.sin(i * 2.5) * 20;
        return {
            name,
            level: Math.max(5, Math.min(100, Math.round(completionBase + jitter + (i === 0 ? 15 : 0)))),
            color: skillColors[i % skillColors.length],
        };
    });

    const overallLevel = Math.round(skillData.reduce((s, sk) => s + sk.level, 0) / skillData.length);

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h2 style={{ marginBottom: 4 }}>📊 Skill <span className="gradient-text">Progress</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Track your growth in {substream || 'your field'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--accent-primary)' }}>{overallLevel}%</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall</div>
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="glass-card" style={{ padding: 20, marginBottom: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{substream || 'General'} Mastery</span>
                        <span className="gradient-text" style={{ fontWeight: 700 }}>{overallLevel}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                        <div className="progress-bar-fill" style={{ width: `${overallLevel}%` }} />
                    </div>
                </div>

                {/* Individual Skills */}
                <div className="section-title" style={{ marginBottom: 16 }}>Individual Skills</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                    {skillData.map((skill, i) => (
                        <div key={i} className="glass-card" style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{skill.name}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: skill.color }}>{skill.level}%</span>
                            </div>
                            <div className="progress-bar" style={{ height: 8 }}>
                                <div className="progress-bar-fill" style={{
                                    width: `${skill.level}%`, background: skill.color,
                                    transition: 'width 0.8s ease',
                                }} />
                            </div>
                            <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {skill.level >= 80 ? '🌟 Advanced' : skill.level >= 50 ? '📈 Intermediate' : '🌱 Building'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Level Badges */}
                <div className="section-title" style={{ marginBottom: 16 }}>Milestones</div>
                <div style={{ display: 'flex', gap: 16 }}>
                    {[
                        { icon: '🌱', label: 'Foundations', min: 0, max: 30 },
                        { icon: '📚', label: 'Learner', min: 30, max: 55 },
                        { icon: '🚀', label: 'Practitioner', min: 55, max: 80 },
                        { icon: '🏆', label: 'Expert', min: 80, max: 101 },
                    ].map((badge, i) => {
                        const active = overallLevel >= badge.min && overallLevel < badge.max;
                        const completed = overallLevel >= badge.max;
                        return (
                            <div key={i} className="glass-card" style={{
                                flex: 1, padding: 20, textAlign: 'center',
                                border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                                opacity: completed || active ? 1 : 0.4,
                            }}>
                                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{badge.icon}</div>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: active ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{badge.label}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{badge.min}–{badge.max - 1}%</div>
                                {completed && <div style={{ fontSize: '0.72rem', color: '#00e676', marginTop: 4 }}>✅ Achieved</div>}
                                {active && <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', marginTop: 4 }}>● Current</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
