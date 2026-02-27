import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const statusColors = {
    completed: { bg: 'rgba(0,230,118,0.08)', border: 'rgba(0,230,118,0.3)', text: '#00e676' },
    'in-progress': { bg: 'rgba(108,99,255,0.08)', border: 'rgba(108,99,255,0.3)', text: '#6c63ff' },
    upcoming: { bg: 'rgba(255,255,255,0.02)', border: 'var(--border-glass)', text: 'var(--text-muted)' },
};

export default function Roadmap() {
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState([]);
    const [field, setField] = useState('');
    const [substream, setSubstream] = useState('');
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [expandedWeek, setExpandedWeek] = useState(null);

    useEffect(() => { loadRoadmap(); }, []);

    const loadRoadmap = () => {
        api.getRoadmap()
            .then(data => {
                setRoadmap(data.roadmap || []);
                setField(data.field || '');
                setSubstream(data.substream || '');
                setProgress(data.progress || 0);
                // Auto-expand first in-progress week
                const inProgress = (data.roadmap || []).find(w => w.status === 'in-progress');
                if (inProgress && expandedWeek === null) setExpandedWeek(inProgress.week);
            })
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    };

    const toggleDay = async (dayId) => {
        try {
            await api.toggleRoadmapDay(dayId);
            loadRoadmap();
        } catch { }
    };

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
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ marginBottom: 8 }}>Your <span className="gradient-text">Roadmap</span></h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {field && substream ? `${field} · ${substream}` : 'Complete your profile to generate a roadmap'}
                        </p>
                        {substream && (
                            <span style={{
                                padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem',
                                background: 'rgba(108,99,255,0.1)', color: 'var(--accent-primary)', fontWeight: 600,
                            }}>{substream}</span>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="glass-card" style={{ padding: 20, marginBottom: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F3F4F6' }}>Overall Progress</span>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {roadmap.map(week => {
                            const sc = statusColors[week.status] || statusColors.upcoming;
                            const isExpanded = expandedWeek === week.week;
                            const completedDays = (week.days || []).filter(d => d.completed).length;
                            const totalDays = (week.days || []).length;
                            const weekPct = totalDays > 0 ? Math.round(completedDays / totalDays * 100) : 0;

                            return (
                                <div key={week.week} className="glass-card" style={{
                                    padding: 0, borderLeft: `4px solid ${sc.text}`, overflow: 'hidden',
                                }}>
                                    {/* Week Header — clickable to expand */}
                                    <button onClick={() => setExpandedWeek(isExpanded ? null : week.week)} style={{
                                        width: '100%', padding: '20px 24px', background: 'none', border: 'none',
                                        cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                <span style={{
                                                    fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                                                    color: sc.text, letterSpacing: '0.05em',
                                                }}>Week {week.week}</span>
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                                    fontSize: '0.7rem', fontWeight: 600, color: sc.text,
                                                    background: sc.bg, border: `1px solid ${sc.border}`,
                                                }}>{week.status}</span>
                                            </div>
                                            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F3F4F6' }}>{week.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 4 }}>
                                                {completedDays}/{totalDays} days completed · {weekPct}%
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {/* Mini progress ring */}
                                            <svg width="40" height="40" viewBox="0 0 40 40">
                                                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                                                <circle cx="20" cy="20" r="16" fill="none" stroke={sc.text} strokeWidth="3"
                                                    strokeDasharray={`${weekPct} ${100 - weekPct}`} strokeDashoffset="25"
                                                    strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.3s' }} />
                                                <text x="20" y="20" textAnchor="middle" dy="0.35em" fill={sc.text}
                                                    fontSize="10" fontWeight="700">{weekPct}%</text>
                                            </svg>
                                            <span style={{
                                                fontSize: '1.2rem', color: '#9CA3AF', transition: 'transform 0.2s',
                                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}>▼</span>
                                        </div>
                                    </button>

                                    {/* Expanded Day Items */}
                                    {isExpanded && (
                                        <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--border-glass)' }}>
                                            {(week.days || []).map(day => (
                                                <div key={day.id} style={{
                                                    display: 'flex', alignItems: 'center', gap: 12,
                                                    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                }}>
                                                    <input type="checkbox" checked={day.completed}
                                                        onChange={() => toggleDay(day.id)}
                                                        style={{ width: 20, height: 20, accentColor: 'var(--accent-primary)', cursor: 'pointer', flexShrink: 0 }} />
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                        background: day.completed ? 'rgba(0,230,118,0.15)' : 'rgba(108,99,255,0.1)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.72rem', fontWeight: 700,
                                                        color: day.completed ? '#00e676' : 'var(--accent-primary)',
                                                    }}>D{day.day}</div>
                                                    <span style={{
                                                        flex: 1, fontSize: '0.92rem',
                                                        color: day.completed ? '#9CA3AF' : '#F3F4F6',
                                                        textDecoration: day.completed ? 'line-through' : 'none',
                                                    }}>{day.title}</span>
                                                    {day.completed && (
                                                        <span style={{ fontSize: '0.75rem', color: '#00e676' }}>✓</span>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Project */}
                                            {week.project && (
                                                <div style={{
                                                    marginTop: 12, padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                                    background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)',
                                                    fontSize: '0.85rem', color: '#D1D5DB',
                                                }}>
                                                    🎯 <strong style={{ color: '#F3F4F6' }}>Project:</strong> {week.project}
                                                </div>
                                            )}
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
