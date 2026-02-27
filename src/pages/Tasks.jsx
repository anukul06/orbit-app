import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import CircularProgress from '../components/CircularProgress';

export default function Tasks() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [streak, setStreak] = useState(0);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getTasks()
            .then(data => { setTasks(data.tasks || []); setStreak(data.streak || 0); })
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, []);

    const toggleTask = async (task) => {
        try {
            await api.updateTask(task.id, { done: !task.done });
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
            if (!task.done) setStreak(s => s + 1);
        } catch { }
    };

    const addTask = async () => {
        if (!newTask.trim()) return;
        try {
            const data = await api.createTask({ title: newTask.trim() });
            setTasks(prev => [...prev, data.task]);
            setNewTask('');
        } catch { }
    };

    const deleteTask = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch { }
    };

    const priorityColor = (p) => ({ high: '#ff5252', medium: '#ffab40', low: '#00e676' }[p] || '#6c63ff');
    const priorityBg = (p) => ({ high: 'rgba(255,82,82,0.1)', medium: 'rgba(255,171,64,0.1)', low: 'rgba(0,230,118,0.1)' }[p] || 'rgba(108,99,255,0.1)');

    const doneTasks = tasks.filter(t => t.done);
    const pendingTasks = tasks.filter(t => !t.done);
    const completionPct = tasks.length > 0 ? Math.round(doneTasks.length / tasks.length * 100) : 0;

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <h2 style={{ marginBottom: 4 }}>Daily <span className="gradient-text">Tasks</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{doneTasks.length} of {tasks.length} completed today</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-warning)' }}>🔥 {streak}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Streak</div>
                        </div>
                        <CircularProgress value={completionPct} size={80} label="Done" />
                    </div>
                </div>

                {/* Add Task */}
                <div className="glass-card" style={{ padding: 16, marginBottom: 24, display: 'flex', gap: 12 }}>
                    <input type="text" className="input-field" placeholder="Add a new task..."
                        value={newTask} onChange={e => setNewTask(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                        style={{ flex: 1, margin: 0 }} id="new-task-input" />
                    <button className="btn btn-primary" onClick={addTask} style={{ whiteSpace: 'nowrap' }}>+ Add</button>
                </div>

                {/* Pending Tasks */}
                <div className="section-title" style={{ marginBottom: 12 }}>Pending ({pendingTasks.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                    {pendingTasks.length === 0 ? (
                        <div className="glass-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                            All tasks completed! 🎉
                        </div>
                    ) : (
                        pendingTasks.map(task => (
                            <div key={task.id} className="glass-card" style={{
                                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
                            }}>
                                <input type="checkbox" checked={false} onChange={() => toggleTask(task)}
                                    style={{ width: 20, height: 20, accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                                <span style={{ flex: 1, fontSize: '0.95rem' }}>{task.text}</span>
                                <span style={{
                                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                                    fontSize: '0.72rem', fontWeight: 600, color: priorityColor(task.priority),
                                    background: priorityBg(task.priority),
                                }}>{task.priority}</span>
                                {task.deadline && (
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📅 {task.deadline}</span>
                                )}
                                <button onClick={() => deleteTask(task.id)} style={{
                                    background: 'none', border: 'none', color: 'var(--text-muted)',
                                    cursor: 'pointer', fontSize: '1rem', padding: '4px',
                                }}>🗑</button>
                            </div>
                        ))
                    )}
                </div>

                {/* Completed Tasks */}
                {doneTasks.length > 0 && (
                    <>
                        <div className="section-title" style={{ marginBottom: 12 }}>Completed ({doneTasks.length})</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {doneTasks.map(task => (
                                <div key={task.id} className="glass-card" style={{
                                    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14,
                                    opacity: 0.6,
                                }}>
                                    <input type="checkbox" checked={true} onChange={() => toggleTask(task)}
                                        style={{ width: 20, height: 20, accentColor: 'var(--accent-success)', cursor: 'pointer' }} />
                                    <span style={{ flex: 1, fontSize: '0.95rem', textDecoration: 'line-through' }}>{task.text}</span>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 'var(--radius-full)',
                                        fontSize: '0.72rem', fontWeight: 600, color: '#00e676',
                                        background: 'rgba(0,230,118,0.1)',
                                    }}>done</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
