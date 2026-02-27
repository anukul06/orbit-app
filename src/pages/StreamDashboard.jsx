import React, { useState } from 'react';
import CircularProgress from '../components/CircularProgress';

const roadmap = [
    {
        week: 1,
        title: 'Foundations & Setup',
        tasks: [
            { text: 'Introduction to AI concepts', done: true },
            { text: 'Python fundamentals review', done: true },
            { text: 'Set up development environment', done: true },
            { text: 'Linear algebra refresher', done: false },
        ],
        project: 'Hello AI: Build a simple chatbot',
    },
    {
        week: 2,
        title: 'Data & Algorithms',
        tasks: [
            { text: 'NumPy & Pandas deep dive', done: true },
            { text: 'Data preprocessing techniques', done: false },
            { text: 'Search algorithms overview', done: false },
            { text: 'Probability & statistics basics', done: false },
        ],
        project: 'Data Wrangling: Clean & analyze a dataset',
    },
    {
        week: 3,
        title: 'Machine Learning Core',
        tasks: [
            { text: 'Supervised learning concepts', done: false },
            { text: 'Build a regression model', done: false },
            { text: 'Classification algorithms', done: false },
            { text: 'Model evaluation metrics', done: false },
        ],
        project: 'Predictor: Housing price prediction model',
    },
    {
        week: 4,
        title: 'Neural Networks & Beyond',
        tasks: [
            { text: 'Neural network fundamentals', done: false },
            { text: 'Build a neural net from scratch', done: false },
            { text: 'Intro to TensorFlow/PyTorch', done: false },
            { text: 'Capstone project planning', done: false },
        ],
        project: 'Image Classifier: CNN-based recognition system',
    },
];

const dailyTasks = [
    { text: 'Review yesterday\'s notes', done: true },
    { text: 'Complete linear algebra exercise', done: false },
    { text: 'Watch lecture: Search Algorithms', done: false },
    { text: 'Practice coding challenge', done: false },
    { text: 'Read documentation: NumPy arrays', done: false },
];

const reminders = [
    { task: 'Submit Week 1 Reflection', deadline: 'Today, 11:59 PM', urgent: true },
    { task: 'Linear Algebra Quiz', deadline: 'Tomorrow, 3:00 PM', urgent: false },
    { task: 'Mini-Project Checkpoint', deadline: 'In 3 days', urgent: false },
];

const notes = [
    {
        title: 'Introduction to AI',
        type: 'AI Generated',
        topics: ['What is AI?', 'History of AI', 'Types of AI', 'AI Applications'],
    },
    {
        title: 'Python for AI',
        type: 'Module Notes',
        topics: ['Data types', 'Functions', 'OOP Basics', 'Libraries Overview'],
    },
    {
        title: 'Linear Algebra Essentials',
        type: 'Resource Link',
        topics: ['Vectors & Matrices', 'Dot Product', 'Eigenvalues', 'Transformations'],
    },
];

export default function StreamDashboard() {
    const [tasks, setTasks] = useState(dailyTasks);
    const completedCount = tasks.filter(t => t.done).length;
    const completionPct = Math.round((completedCount / tasks.length) * 100);
    const totalRoadmapTasks = roadmap.reduce((acc, w) => acc + w.tasks.length, 0);
    const completedRoadmapTasks = roadmap.reduce((acc, w) => acc + w.tasks.filter(t => t.done).length, 0);
    const overallProgress = Math.round((completedRoadmapTasks / totalRoadmapTasks) * 100);

    const toggleTask = (index) => {
        setTasks(prev => prev.map((t, i) => i === index ? { ...t, done: !t.done } : t));
    };

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
                {/* Header */}
                <div className="animate-fade-in" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 36,
                }}>
                    <div>
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
                        <h2 style={{ marginBottom: 4 }}>Stream <span className="gradient-text">Dashboard</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Your personalized AI learning journey</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div className="streak-counter">🔥 7 Day Streak</div>
                        <CircularProgress value={72} size={100} label="Clarity" />
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="glass-card animate-fade-in delay-100" style={{
                    padding: '20px 28px', marginBottom: 32,
                    display: 'flex', alignItems: 'center', gap: 24,
                }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        Overall Progress
                    </span>
                    <div className="progress-bar" style={{ flex: 1, height: 12, borderRadius: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${overallProgress}%`, borderRadius: 6 }} />
                    </div>
                    <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                        {overallProgress}%
                    </span>
                </div>

                {/* Main Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
                    {/* Left Column */}
                    <div>
                        {/* Roadmap */}
                        <div className="section-title">4-Week Roadmap</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
                            {roadmap.map((week, wi) => {
                                const wDone = week.tasks.filter(t => t.done).length;
                                const wPct = Math.round((wDone / week.tasks.length) * 100);
                                return (
                                    <div key={wi} className={`glass-card animate-slide-up delay-${(wi + 1) * 100}`} style={{ padding: 24 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                                    background: wPct === 100 ? 'rgba(0, 230, 118, 0.15)' : 'rgba(108, 99, 255, 0.15)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: '0.85rem',
                                                    color: wPct === 100 ? 'var(--accent-success)' : 'var(--accent-primary)',
                                                }}>W{week.week}</div>
                                                <div>
                                                    <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{week.title}</h4>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        {wDone}/{week.tasks.length} tasks completed
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="gradient-text" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                                {wPct}%
                                            </span>
                                        </div>

                                        <div className="progress-bar" style={{ marginBottom: 16, height: 6 }}>
                                            <div className="progress-bar-fill" style={{ width: `${wPct}%` }} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                                            {week.tasks.map((task, ti) => (
                                                <div key={ti} style={{
                                                    display: 'flex', alignItems: 'center', gap: 10,
                                                    padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.9rem',
                                                }}>
                                                    <div style={{
                                                        width: 18, height: 18, borderRadius: 4,
                                                        border: `2px solid ${task.done ? 'var(--accent-success)' : 'var(--border-accent)'}`,
                                                        background: task.done ? 'var(--accent-success)' : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.7rem', color: 'white', flexShrink: 0,
                                                    }}>
                                                        {task.done && '✓'}
                                                    </div>
                                                    <span style={{
                                                        color: task.done ? 'var(--text-muted)' : 'var(--text-primary)',
                                                        textDecoration: task.done ? 'line-through' : 'none',
                                                    }}>{task.text}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '10px 14px',
                                            background: 'rgba(255, 171, 64, 0.08)',
                                            border: '1px solid rgba(255, 171, 64, 0.15)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.85rem',
                                        }}>
                                            <span>🏆</span>
                                            <span style={{ color: 'var(--accent-warning)', fontWeight: 500 }}>Mini-Project:</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{week.project}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Notes & Classes */}
                        <div className="section-title">Notes & Resources</div>
                        <div className="grid grid-3" style={{ gap: 16 }}>
                            {notes.map((note, i) => (
                                <div key={i} className="glass-card animate-fade-in delay-500" style={{ padding: 20 }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                                        marginBottom: 12,
                                    }}>
                                        <h4 style={{ fontSize: '0.95rem', flex: 1 }}>{note.title}</h4>
                                        <span className="badge badge-easy" style={{
                                            fontSize: '0.65rem', padding: '2px 8px',
                                        }}>{note.type}</span>
                                    </div>
                                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {note.topics.map((topic, ti) => (
                                            <li key={ti} style={{
                                                fontSize: '0.85rem', color: 'var(--text-secondary)',
                                                display: 'flex', alignItems: 'center', gap: 8,
                                            }}>
                                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Task & Habit Tracker */}
                        <div className="section-title">Daily Tasks</div>
                        <div className="glass-card animate-fade-in-right delay-200" style={{ padding: 24, marginBottom: 24 }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: 20,
                            }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Completion
                                </span>
                                <span className="gradient-text" style={{ fontWeight: 700 }}>
                                    {completionPct}%
                                </span>
                            </div>
                            <div className="progress-bar" style={{ marginBottom: 20, height: 6 }}>
                                <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {tasks.map((task, i) => (
                                    <label key={i} className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={task.done}
                                            onChange={() => toggleTask(i)}
                                        />
                                        <span className="task-label">{task.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reminders */}
                        <div className="section-title">Reminders</div>
                        <div className="glass-card animate-fade-in-right delay-300" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
                            {reminders.map((r, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '16px 20px',
                                    borderBottom: i < reminders.length - 1 ? '1px solid var(--border-glass)' : 'none',
                                    background: r.urgent ? 'rgba(255, 82, 82, 0.04)' : 'transparent',
                                }}>
                                    <div style={{
                                        width: 10, height: 10, borderRadius: '50%',
                                        background: r.urgent ? 'var(--accent-danger)' : 'var(--accent-warning)',
                                        boxShadow: r.urgent ? '0 0 8px rgba(255,82,82,0.4)' : 'none',
                                        flexShrink: 0,
                                        animation: r.urgent ? 'pulse 2s infinite' : 'none',
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', marginBottom: 2 }}>{r.task}</div>
                                        <div style={{
                                            fontSize: '0.78rem',
                                            color: r.urgent ? 'var(--accent-danger)' : 'var(--text-muted)',
                                            fontWeight: r.urgent ? 600 : 400,
                                        }}>{r.deadline}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Adaptive Feedback */}
                        <div className="section-title">Adaptive Feedback</div>
                        <div className="glass-card animate-fade-in-right delay-400" style={{
                            padding: 24,
                            border: '1px solid rgba(108, 99, 255, 0.2)',
                            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.06) 0%, rgba(0, 212, 255, 0.03) 100%)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <span style={{
                                    fontSize: '1.2rem', width: 32, height: 32,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(108, 99, 255, 0.15)',
                                    borderRadius: 'var(--radius-sm)',
                                }}>🧠</span>
                                <h4 style={{ fontSize: '0.95rem' }}>AI Analysis</h4>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Engagement Summary
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    You've been most active on Python tasks. Your engagement drops during mathematical concepts.
                                </p>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Behavior Insight
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    Peak productivity occurs between 9–11 AM. Consider scheduling complex tasks during this window.
                                </p>
                            </div>

                            <div style={{
                                padding: '14px 16px',
                                background: 'rgba(255, 171, 64, 0.08)',
                                border: '1px solid rgba(255, 171, 64, 0.15)',
                                borderRadius: 'var(--radius-md)',
                            }}>
                                <div style={{ fontSize: '0.82rem', color: 'var(--accent-warning)', marginBottom: 6, fontWeight: 600 }}>
                                    💡 Suggested Adjustment
                                </div>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    "You skipped algorithm tasks this week. Consider reviewing fundamentals before moving to neural networks."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
