import React from 'react';

const roadmap = [
    {
        week: 1,
        title: 'Foundations & Setup',
        topics: [
            'Introduction to AI concepts',
            'Python fundamentals review',
            'Set up development environment',
            'Linear algebra refresher',
        ],
        project: 'Hello AI: Build a simple chatbot',
        status: 'completed',
    },
    {
        week: 2,
        title: 'Data & Algorithms',
        topics: [
            'NumPy & Pandas deep dive',
            'Data preprocessing techniques',
            'Search algorithms overview',
            'Probability & statistics basics',
        ],
        project: 'Data Wrangling: Clean & analyze a dataset',
        status: 'in-progress',
    },
    {
        week: 3,
        title: 'Machine Learning Core',
        topics: [
            'Supervised learning concepts',
            'Build a regression model',
            'Classification algorithms',
            'Model evaluation metrics',
        ],
        project: 'Predictor: Housing price prediction model',
        status: 'upcoming',
    },
    {
        week: 4,
        title: 'Neural Networks & Beyond',
        topics: [
            'Neural network fundamentals',
            'Build a neural net from scratch',
            'Intro to TensorFlow/PyTorch',
            'Capstone project planning',
        ],
        project: 'Image Classifier: CNN-based recognition system',
        status: 'upcoming',
    },
];

export default function Roadmap() {
    const completedWeeks = roadmap.filter(w => w.status === 'completed').length;
    const overallProgress = Math.round((completedWeeks / roadmap.length) * 100);

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 14px',
                        background: 'rgba(108, 99, 255, 0.1)',
                        border: '1px solid rgba(108, 99, 255, 0.2)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 500,
                        marginBottom: 12
                    }}>
                        🤖 Artificial Intelligence
                    </div>
                    <h2 style={{ marginBottom: 4 }}>Learning <span className="gradient-text">Roadmap</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Your 4-week structured learning plan</p>
                </div>

                {/* Overall Progress */}
                <div className="glass-card" style={{
                    padding: '20px 28px', marginBottom: 32,
                    display: 'flex', alignItems: 'center', gap: 24,
                }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        Overall Progress
                    </span>
                    <div className="progress-bar" style={{ flex: 1, height: 12, borderRadius: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${overallProgress}%`, borderRadius: 6 }} />
                    </div>
                    <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {overallProgress}%
                    </span>
                </div>

                {/* Weekly Milestones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {roadmap.map((week, wi) => {
                        const statusColor = week.status === 'completed' ? 'var(--accent-success)' :
                            week.status === 'in-progress' ? 'var(--accent-primary)' : 'var(--text-muted)';
                        const statusLabel = week.status === 'completed' ? 'Completed' :
                            week.status === 'in-progress' ? 'In Progress' : 'Upcoming';

                        return (
                            <div key={wi} className="glass-card" style={{ padding: 28 }}>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    marginBottom: 20,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                                            background: week.status === 'completed' ? 'rgba(0,230,118,0.12)' :
                                                week.status === 'in-progress' ? 'rgba(108,99,255,0.12)' : 'rgba(255,255,255,0.04)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '1rem', color: statusColor,
                                            border: `1px solid ${statusColor}30`,
                                        }}>
                                            {week.status === 'completed' ? '✓' : `W${week.week}`}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: 2 }}>Week {week.week}: {week.title}</h3>
                                            <span style={{ fontSize: '0.82rem', color: statusColor, fontWeight: 600 }}>
                                                {statusLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Topics */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px',
                                    marginBottom: 18, paddingLeft: 4,
                                }}>
                                    {week.topics.map((topic, ti) => (
                                        <div key={ti} style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            fontSize: '0.92rem', color: 'var(--text-secondary)',
                                        }}>
                                            <span style={{
                                                width: 6, height: 6, borderRadius: '50%',
                                                background: statusColor, flexShrink: 0, opacity: 0.7,
                                            }} />
                                            {topic}
                                        </div>
                                    ))}
                                </div>

                                {/* Mini-project */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '12px 16px',
                                    background: 'rgba(255, 171, 64, 0.06)',
                                    border: '1px solid rgba(255, 171, 64, 0.12)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.88rem',
                                }}>
                                    <span>🏆</span>
                                    <span style={{ color: 'var(--accent-warning)', fontWeight: 600 }}>Mini-Project:</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{week.project}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
