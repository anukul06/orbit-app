import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const statusColors = {
    completed: { bg: 'rgba(0,230,118,0.1)', border: 'rgba(0,230,118,0.3)', text: '#00e676' },
    'in-progress': { bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.3)', text: '#6c63ff' },
    upcoming: { bg: 'rgba(255,255,255,0.03)', border: 'var(--border-glass)', text: 'var(--text-muted)' },
};

export default function Roadmap() {
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState([]);
    const [field, setField] = useState('');
    const [substream, setSubstream] = useState('');
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getRoadmap()
            .then(data => {
                setRoadmap(data.roadmap || []);
                setField(data.field || '');
                setSubstream(data.substream || '');
                setProgress(data.progress || 0);
            })
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading roadmap...</p>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 900, margin: '0 auto' }}>
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ marginBottom: 8 }}>Your <span className="gradient-text">Roadmap</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {field && substream ? `${field} · ${substream}` : 'Complete your profile to generate a roadmap'}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="glass-card" style={{ padding: 20, marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Overall Progress</span>
                        <span className="gradient-text" style={{ fontWeight: 700 }}>{progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {roadmap.length === 0 ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No roadmap yet. Complete your profile to generate one.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/complete-profile')} style={{ marginTop: 16 }}>
                            Complete Profile →
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {roadmap.map((week, i) => {
                            const sc = statusColors[week.status] || statusColors.upcoming;
                            return (
                                <div key={i} className="glass-card" style={{
                                    padding: 28,
                                    borderLeft: `4px solid ${sc.text}`,
                                    background: sc.bg,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <div>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                                                color: sc.text, letterSpacing: '0.05em',
                                            }}>Week {week.week}</span>
                                            <h3 style={{ marginTop: 4, fontSize: '1.1rem' }}>{week.title}</h3>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem', fontWeight: 600, color: sc.text,
                                            background: sc.bg, border: `1px solid ${sc.border}`,
                                        }}>{week.status}</span>
                                    </div>

                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                                        {(week.topics || []).map((topic, j) => (
                                            <li key={j} style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                color: 'var(--text-secondary)', fontSize: '0.9rem',
                                            }}>
                                                <span style={{ color: sc.text, fontSize: '0.7rem' }}>●</span>
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>

                                    {week.project && (
                                        <div style={{
                                            padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                                            fontSize: '0.85rem', color: 'var(--text-secondary)',
                                        }}>
                                            🎯 <strong>Project:</strong> {week.project}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
