import React from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '../components/CircularProgress';

const fields = [
    {
        icon: '💻',
        name: 'Computer Science',
        desc: 'Software development, AI, data science, cybersecurity and more.',
        color: '#6c63ff',
    },
    {
        icon: '🏗️',
        name: 'Civil Engineering',
        desc: 'Infrastructure design, structural analysis, urban planning.',
        color: '#00d4ff',
    },
    {
        icon: '⚕️',
        name: 'Medical',
        desc: 'Healthcare, biotechnology, pharmaceutical research.',
        color: '#ff6b9d',
    },
    {
        icon: '📊',
        name: 'Commerce',
        desc: 'Finance, accounting, business analytics, economics.',
        color: '#ffab40',
    },
    {
        icon: '🎨',
        name: 'Arts',
        desc: 'Design, media, literature, performing arts, humanities.',
        color: '#00e676',
    },
];

const recentActivity = [
    { icon: '✅', text: 'Completed "Intro to Python" module', time: '2h ago' },
    { icon: '📝', text: 'Submitted weekly reflection', time: '1d ago' },
    { icon: '🏆', text: 'Earned 3-day streak badge', time: '2d ago' },
    { icon: '📖', text: 'Started "Data Structures" roadmap', time: '3d ago' },
];

const upcomingTasks = [
    { title: 'Complete Algorithm Basics Quiz', due: 'Today', priority: 'high' },
    { title: 'Read Chapter 4: Linked Lists', due: 'Tomorrow', priority: 'medium' },
    { title: 'Submit Mini-Project Proposal', due: 'In 3 days', priority: 'low' },
];

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
                {/* Top Section */}
                <div className="animate-fade-in" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 48,
                }}>
                    <div>
                        <h2 style={{ marginBottom: 8 }}>Welcome back, <span className="gradient-text">Anukul</span> 👋</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            Current Field: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Computer Science</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                        <CircularProgress value={72} size={120} label="Clarity" />
                    </div>
                </div>

                {/* Main Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
                    {/* Left: Field Selection */}
                    <div>
                        <div className="section-title">Explore Fields</div>
                        <div className="grid" style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: 20
                        }}>
                            {fields.map((field, i) => (
                                <div
                                    key={i}
                                    className={`glass-card animate-slide-up delay-${(i + 1) * 100}`}
                                    style={{ padding: 24, cursor: 'pointer' }}
                                    onClick={() => navigate('/stream-selection')}
                                    id={`field-${field.name.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                    <div style={{
                                        fontSize: '2rem', marginBottom: 12,
                                        width: 48, height: 48,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: `${field.color}15`,
                                        borderRadius: 'var(--radius-md)',
                                    }}>{field.icon}</div>
                                    <h4 style={{ marginBottom: 8 }}>{field.name}</h4>
                                    <p style={{
                                        color: 'var(--text-secondary)', fontSize: '0.88rem',
                                        lineHeight: 1.5, marginBottom: 16
                                    }}>{field.desc}</p>
                                    <button className="btn btn-secondary btn-sm" style={{
                                        borderColor: field.color + '40',
                                        color: field.color,
                                    }}>
                                        Explore →
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div style={{ marginTop: 40 }}>
                            <div className="section-title">Recent Activity</div>
                            <div className="glass-card animate-fade-in delay-500" style={{ padding: 0, overflow: 'hidden' }}>
                                {recentActivity.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        padding: '16px 24px',
                                        borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-glass)' : 'none',
                                        transition: 'background var(--transition-fast)',
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                        <span style={{ flex: 1, fontSize: '0.93rem' }}>{item.text}</span>
                                        <span style={{
                                            fontSize: '0.8rem', color: 'var(--text-muted)',
                                            whiteSpace: 'nowrap'
                                        }}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div style={{ marginTop: 32 }}>
                            <div className="section-title">Upcoming Tasks</div>
                            <div className="glass-card animate-fade-in delay-600" style={{ padding: 0, overflow: 'hidden' }}>
                                {upcomingTasks.map((task, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        padding: '16px 24px',
                                        borderBottom: i < upcomingTasks.length - 1 ? '1px solid var(--border-glass)' : 'none',
                                    }}>
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: task.priority === 'high' ? 'var(--accent-danger)' :
                                                task.priority === 'medium' ? 'var(--accent-warning)' : 'var(--accent-success)',
                                            boxShadow: `0 0 8px ${task.priority === 'high' ? 'rgba(255,82,82,0.4)' :
                                                task.priority === 'medium' ? 'rgba(255,171,64,0.4)' : 'rgba(0,230,118,0.4)'}`,
                                        }} />
                                        <span style={{ flex: 1, fontSize: '0.93rem' }}>{task.title}</span>
                                        <span className={`badge badge-${task.priority === 'high' ? 'hard' : task.priority === 'medium' ? 'medium' : 'easy'}`}>
                                            {task.due}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div>
                        {/* AI Insight Box */}
                        <div className="glass-card animate-fade-in-right delay-300" style={{
                            padding: 28,
                            border: '1px solid rgba(108, 99, 255, 0.25)',
                            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.08) 0%, rgba(0, 212, 255, 0.04) 100%)',
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                marginBottom: 16
                            }}>
                                <span style={{
                                    fontSize: '1.3rem',
                                    width: 36, height: 36,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(108, 99, 255, 0.15)',
                                    borderRadius: 'var(--radius-md)',
                                }}>🧠</span>
                                <h4 style={{ fontSize: '1rem' }}>AI Insight</h4>
                            </div>
                            <p style={{
                                color: 'var(--text-secondary)', fontSize: '0.93rem',
                                lineHeight: 1.7, fontStyle: 'italic',
                            }}>
                                "You show strong interest in analytical domains. Based on your recent activity patterns,
                                consider exploring <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Data Science</span> —
                                it aligns well with your problem-solving strengths."
                            </p>
                            <div style={{ marginTop: 16 }}>
                                <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.82rem' }}>
                                    View Full Analysis →
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="glass-card animate-fade-in-right delay-400" style={{ padding: 24, marginTop: 20 }}>
                            <h4 style={{ marginBottom: 20, fontSize: '1rem' }}>Quick Stats</h4>
                            {[
                                { label: 'Tasks Completed', value: '24/32', pct: 75, color: '#6c63ff' },
                                { label: 'Weekly Goal', value: '80%', pct: 80, color: '#00d4ff' },
                                { label: 'Streak', value: '7 days', pct: 100, color: '#ffab40' },
                            ].map((stat, i) => (
                                <div key={i} style={{ marginBottom: i < 2 ? 20 : 0 }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        marginBottom: 8, fontSize: '0.88rem'
                                    }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                                        <span style={{ fontWeight: 600, color: stat.color }}>{stat.value}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{
                                            width: `${stat.pct}%`,
                                            background: stat.color,
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Motivation */}
                        <div className="glass-card animate-fade-in-right delay-500" style={{
                            padding: 24, marginTop: 20, textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.06) 0%, rgba(0, 212, 255, 0.04) 100%)',
                            border: '1px solid rgba(0, 230, 118, 0.15)',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔥</div>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontWeight: 700,
                                fontSize: '1.8rem', color: 'var(--accent-warning)',
                                marginBottom: 4
                            }}>7 Day Streak!</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                                Keep going — consistency builds mastery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
