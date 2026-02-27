import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import CircularProgress from '../components/CircularProgress';

export default function Insights() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [tasks, setTasks] = useState({ done: 0, total: 0 });
    const [reflection, setReflection] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getDashboard(), api.getStats()])
            .then(([dash, stats]) => {
                setData(dash);
                setTasks({ done: stats.tasks_done, total: stats.tasks_total });
            })
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = () => {
        if (reflection.trim()) {
            setSubmitted(true);
            setReflection('');
        }
    };

    if (loading || !data) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading insights...</p>
            </div>
        );
    }

    const completionRate = tasks.total > 0 ? Math.round(tasks.done / tasks.total * 100) : 0;

    const skillBars = [
        { name: 'Python', level: Math.min(100, completionRate + 20), color: '#6c63ff' },
        { name: 'Problem Solving', level: Math.min(100, data.clarity_score), color: '#00e676' },
        { name: 'Consistency', level: Math.min(100, data.streak * 12), color: '#ffab40' },
        { name: 'Domain Knowledge', level: Math.min(100, data.roadmap_progress + 10), color: '#00d4ff' },
        { name: 'Project Skills', level: Math.min(100, Math.round(completionRate * 0.6)), color: '#ff6b9d' },
    ];

    const weeklyData = [
        { day: 'Mon', score: Math.min(100, completionRate + 5) },
        { day: 'Tue', score: Math.min(100, completionRate + 15) },
        { day: 'Wed', score: Math.min(100, completionRate - 5) },
        { day: 'Thu', score: Math.min(100, completionRate + 20) },
        { day: 'Fri', score: Math.min(100, completionRate - 10) },
        { day: 'Sat', score: Math.min(100, completionRate + 25) },
        { day: 'Sun', score: Math.min(100, completionRate + 10) },
    ];

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ marginBottom: 4 }}>Performance <span className="gradient-text">Insights</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Track your learning progress and engagement</p>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                    {[
                        { label: 'Clarity Score', value: data.clarity_score, unit: '/100', color: '#6c63ff' },
                        { label: 'Completion Rate', value: completionRate, unit: '%', color: '#00e676' },
                        { label: 'Current Streak', value: data.streak, unit: ' days', color: '#ffab40' },
                        { label: 'Roadmap Progress', value: data.roadmap_progress, unit: '%', color: '#00d4ff' },
                    ].map((m, i) => (
                        <div key={i} className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                {m.label}
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '1.8rem', color: m.color }}>
                                {m.value}<span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{m.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                    {/* Engagement Chart */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Weekly Engagement</div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
                            {weeklyData.map((d, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: '100%', height: `${Math.max(10, d.score)}%`,
                                        background: `linear-gradient(to top, #6c63ff, rgba(108,99,255,0.3))`,
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.3s ease',
                                    }} />
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Radar */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Skill Progress</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {skillBars.map((skill, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: '0.85rem' }}>{skill.name}</span>
                                        <span style={{ fontSize: '0.82rem', color: skill.color, fontWeight: 600 }}>{skill.level}%</span>
                                    </div>
                                    <div className="progress-bar" style={{ height: 6 }}>
                                        <div className="progress-bar-fill" style={{ width: `${skill.level}%`, background: skill.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reflection */}
                <div className="glass-card" style={{ padding: 28 }}>
                    <div className="section-title" style={{ marginBottom: 16 }}>Weekly Reflection</div>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: 20, color: 'var(--accent-success)' }}>
                            ✅ Reflection submitted successfully!
                        </div>
                    ) : (
                        <>
                            <textarea placeholder="What did you learn this week? What challenges did you face?"
                                value={reflection} onChange={e => setReflection(e.target.value)}
                                style={{
                                    width: '100%', height: 120, padding: 16, fontSize: '0.92rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                                    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                                    resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                                }}
                                id="reflection-input" />
                            <button className="btn btn-primary" onClick={handleSubmit}
                                style={{ marginTop: 16 }} disabled={!reflection.trim()} id="submit-reflection-btn">
                                Submit Reflection →
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
