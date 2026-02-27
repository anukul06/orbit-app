import React, { useState } from 'react';
import CircularProgress from '../components/CircularProgress';

const initialTasks = [
    { text: 'Review yesterday\'s notes', done: true, priority: 'low', deadline: 'Today' },
    { text: 'Complete linear algebra exercise', done: false, priority: 'high', deadline: 'Today' },
    { text: 'Watch lecture: Search Algorithms', done: false, priority: 'medium', deadline: 'Today' },
    { text: 'Practice coding challenge (LeetCode)', done: false, priority: 'high', deadline: 'Today' },
    { text: 'Read documentation: NumPy arrays', done: false, priority: 'low', deadline: 'Tomorrow' },
    { text: 'Submit Week 1 Reflection', done: false, priority: 'high', deadline: 'Today, 11:59 PM' },
    { text: 'Prepare notes for Data Preprocessing', done: false, priority: 'medium', deadline: 'Tomorrow' },
    { text: 'Complete mini-project milestone 1', done: false, priority: 'high', deadline: 'In 2 days' },
];

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);

    const toggleTask = (index) => {
        setTasks(prev => prev.map((t, i) => i === index ? { ...t, done: !t.done } : t));
    };

    const completedCount = tasks.filter(t => t.done).length;
    const completionPct = Math.round((completedCount / tasks.length) * 100);
    const streak = 7;

    const priorityColor = (p) => p === 'high' ? 'var(--accent-danger)' : p === 'medium' ? 'var(--accent-warning)' : 'var(--accent-success)';
    const priorityBg = (p) => p === 'high' ? 'rgba(255,82,82,0.1)' : p === 'medium' ? 'rgba(255,171,64,0.1)' : 'rgba(0,230,118,0.1)';

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60 }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 32,
                }}>
                    <div>
                        <h2 style={{ marginBottom: 4 }}>Daily <span className="gradient-text">Tasks</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Your daily execution checklist</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div className="streak-counter">🔥 {streak} Day Streak</div>
                        <CircularProgress value={completionPct} size={90} label="Done" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
                    {/* Left: Task List */}
                    <div>
                        {/* Stats Bar */}
                        <div className="glass-card" style={{
                            padding: '16px 24px', marginBottom: 24,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', gap: 32 }}>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{tasks.length}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Done</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-success)' }}>{completedCount}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-warning)' }}>{tasks.length - completedCount}</div>
                                </div>
                            </div>
                            <div style={{ width: 200 }}>
                                <div className="progress-bar" style={{ height: 8 }}>
                                    <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Task Items */}
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {tasks.map((task, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '14px 24px',
                                    borderBottom: i < tasks.length - 1 ? '1px solid var(--border-glass)' : 'none',
                                    background: task.done ? 'rgba(0,230,118,0.02)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s ease',
                                }} onClick={() => toggleTask(i)}>
                                    {/* Checkbox */}
                                    <div style={{
                                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                        border: `2px solid ${task.done ? 'var(--accent-success)' : 'var(--border-accent)'}`,
                                        background: task.done ? 'var(--accent-success)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', color: 'white', fontWeight: 700,
                                        transition: 'all 0.15s ease',
                                    }}>
                                        {task.done && '✓'}
                                    </div>

                                    {/* Task text */}
                                    <span style={{
                                        flex: 1, fontSize: '0.93rem',
                                        color: task.done ? 'var(--text-muted)' : 'var(--text-primary)',
                                        textDecoration: task.done ? 'line-through' : 'none',
                                    }}>{task.text}</span>

                                    {/* Priority badge */}
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 'var(--radius-full)',
                                        fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                                        background: priorityBg(task.priority),
                                        color: priorityColor(task.priority),
                                        border: `1px solid ${priorityColor(task.priority)}20`,
                                    }}>
                                        {task.priority}
                                    </span>

                                    {/* Deadline */}
                                    <span style={{
                                        fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap',
                                        minWidth: 80, textAlign: 'right',
                                    }}>{task.deadline}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Completion Circle */}
                        <div className="glass-card" style={{ padding: 28, textAlign: 'center', marginBottom: 20 }}>
                            <h4 style={{ marginBottom: 20, fontSize: '0.95rem' }}>Today's Progress</h4>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                                <CircularProgress value={completionPct} size={140} label="Complete" />
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                                {completedCount}/{tasks.length} tasks completed
                            </p>
                        </div>

                        {/* Streak */}
                        <div className="glass-card" style={{
                            padding: 24, textAlign: 'center', marginBottom: 20,
                            background: 'linear-gradient(135deg, rgba(255,171,64,0.06) 0%, rgba(255,82,82,0.04) 100%)',
                            border: '1px solid rgba(255,171,64,0.15)',
                        }}>
                            <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>🔥</div>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontWeight: 700,
                                fontSize: '2rem', color: 'var(--accent-warning)',
                            }}>{streak} Days</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
                                Current streak — keep it going!
                            </p>
                        </div>

                        {/* Reminders */}
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h4 style={{ marginBottom: 16, fontSize: '0.95rem' }}>⏰ Upcoming Deadlines</h4>
                            {[
                                { task: 'Submit Reflection', time: 'Today, 11:59 PM', urgent: true },
                                { task: 'Linear Algebra Quiz', time: 'Tomorrow, 3:00 PM', urgent: false },
                                { task: 'Mini-Project Checkpoint', time: 'In 3 days', urgent: false },
                            ].map((r, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 0',
                                    borderBottom: i < 2 ? '1px solid var(--border-glass)' : 'none',
                                }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                        background: r.urgent ? 'var(--accent-danger)' : 'var(--accent-warning)',
                                    }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.88rem' }}>{r.task}</div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: r.urgent ? 'var(--accent-danger)' : 'var(--text-muted)',
                                            fontWeight: r.urgent ? 600 : 400,
                                        }}>{r.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
