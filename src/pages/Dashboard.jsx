import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import CircularProgress from '../components/CircularProgress';

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getDashboard(), api.getInsights()])
            .then(([dash, ins]) => {
                setData(dash);
                setInsight(ins.insight || '');
            })
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
            </div>
        );
    }

    const stats = [
        { label: 'Tasks Done', value: `${data.tasks_done}/${data.tasks_total}`, pct: data.tasks_pct, color: '#6c63ff' },
        { label: 'Weekly Goal', value: `${data.weekly_goal}%`, pct: data.weekly_goal, color: '#00d4ff' },
        { label: 'Streak', value: `${data.streak} days`, pct: Math.min(100, data.streak * 10), color: '#ffab40' },
        { label: 'Roadmap', value: `${data.roadmap_progress}%`, pct: data.roadmap_progress, color: '#00e676' },
    ];

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
                {/* Top Section */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 36,
                }}>
                    <div>
                        <h2 style={{ marginBottom: 8 }}>Welcome back, <span className="gradient-text">{data.user.name || 'User'}</span> 👋</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            Current Field: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{data.user.field || 'Not set'}</span>
                            {' · '}
                            <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>{data.user.substream || 'Not set'}</span>
                        </p>
                    </div>
                    <CircularProgress value={data.clarity_score} size={120} label="Clarity" />
                </div>

                {/* Quick Actions */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
                    marginBottom: 32,
                }}>
                    <button className="glass-card" onClick={() => navigate('/roadmap')}
                        style={{ padding: '20px 24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                            background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.3rem',
                        }}>🗺️</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 2, color: '#F3F4F6' }}>View Roadmap</div>
                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>4-week learning plan</div>
                        </div>
                    </button>
                    <button className="glass-card" onClick={() => navigate('/tasks')}
                        style={{ padding: '20px 24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                            background: 'rgba(0,230,118,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.3rem',
                        }}>✅</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 2, color: '#F3F4F6' }}>View Tasks</div>
                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Daily to-do list</div>
                        </div>
                    </button>
                    <button className="glass-card" onClick={() => navigate('/insights')}
                        style={{ padding: '20px 24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                            background: 'rgba(255,171,64,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.3rem',
                        }}>📊</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 2, color: '#F3F4F6' }}>Complete Reflection</div>
                            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Weekly insights</div>
                        </div>
                    </button>
                </div>

                {/* Main Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
                    {/* Left */}
                    <div>
                        <div className="section-title">Progress Overview</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                            {stats.map((stat, i) => (
                                <div key={i} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '1.3rem', color: stat.color, marginBottom: 10 }}>
                                        {stat.value}
                                    </div>
                                    <div className="progress-bar" style={{ height: 6 }}>
                                        <div className="progress-bar-fill" style={{ width: `${stat.pct}%`, background: stat.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="section-title">Recent Activity</div>
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {(data.recent_activity || []).length === 0 ? (
                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No recent activity yet. Complete some tasks to get started!
                                </div>
                            ) : (
                                data.recent_activity.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        padding: '14px 24px',
                                        borderBottom: i < data.recent_activity.length - 1 ? '1px solid var(--border-glass)' : 'none',
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>{item.done ? '✅' : '📋'}</span>
                                        <span style={{ flex: 1, fontSize: '0.92rem' }}>{item.text}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.time || ''}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div>
                        <div className="glass-card" style={{
                            padding: 24, marginBottom: 20,
                            border: '1px solid rgba(108, 99, 255, 0.2)',
                            background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(0,212,255,0.04) 100%)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                <span style={{
                                    fontSize: '1.2rem', width: 34, height: 34,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(108,99,255,0.15)', borderRadius: 'var(--radius-md)',
                                }}>🧠</span>
                                <h4 style={{ fontSize: '0.95rem' }}>AI Insight</h4>
                            </div>
                            <p style={{
                                color: 'var(--text-secondary)', fontSize: '0.9rem',
                                lineHeight: 1.7, fontStyle: 'italic',
                            }}>
                                "{insight || 'Complete your profile and tasks to receive personalized insights.'}"
                            </p>
                        </div>

                        <div className="glass-card" style={{
                            padding: 24, textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(0,230,118,0.06) 0%, rgba(0,212,255,0.04) 100%)',
                            border: '1px solid rgba(0,230,118,0.15)',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: 6 }}>🔥</div>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontWeight: 700,
                                fontSize: '1.6rem', color: 'var(--accent-warning)',
                            }}>{data.streak} Day Streak!</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
                                Consistency builds mastery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
