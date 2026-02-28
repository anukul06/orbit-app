import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function Insights() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [reflection, setReflection] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getInsights()
            .then(d => setData(d))
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading insights...</p>
            </div>
        );
    }

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Engagement %',
            data: data.weekly_data,
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108, 99, 255, 0.12)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#6c63ff',
            pointBorderColor: '#6c63ff',
            pointRadius: 5,
            pointHoverRadius: 7,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
            y: {
                beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#6B7280', font: { size: 11 } }
            },
            x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 11 } } },
        },
    };

    const statCards = [
        { label: 'Clarity Score', value: `${data.clarity_score}`, icon: '🎯', color: '#6c63ff' },
        { label: 'Completion', value: `${data.tasks_pct}%`, icon: '✅', color: '#00e676' },
        { label: 'Streak', value: `${data.streak} days`, icon: '🔥', color: '#ffab40' },
        { label: 'Roadmap', value: `${data.roadmap_pct}%`, icon: '🗺️', color: '#00d4ff' },
    ];

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 1000, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ marginBottom: 4 }}>📊 <span className="gradient-text">Insights</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {data.field && data.substream ? `${data.field} · ${data.substream}` : 'Your performance analytics'}
                    </p>
                </div>

                {/* Top Row: 4 Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                    {statCards.map(s => (
                        <div key={s.label} className="glass-card" style={{ padding: '18px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Trend indicator */}
                <div className="glass-card" style={{ padding: '10px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                        fontSize: '0.85rem', fontWeight: 600,
                        color: data.trend >= 0 ? '#00e676' : '#ff5252',
                    }}>{data.trend_label}</span>
                    <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>· Avg Engagement: {data.avg_engagement}%</span>
                </div>

                {/* Middle Row: Graph + Skills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 24 }}>
                    {/* Weekly Engagement Graph */}
                    <div className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F3F4F6' }}>Weekly Engagement</div>
                                <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                                    Most productive: <strong style={{ color: '#6c63ff' }}>{data.best_day}</strong>
                                </div>
                            </div>
                            <div style={{
                                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                                fontSize: '0.72rem', fontWeight: 600,
                                background: 'rgba(108,99,255,0.1)', color: '#6c63ff',
                            }}>This Week</div>
                        </div>
                        <div style={{ height: 220 }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Skill Progress */}
                    <div className="glass-card" style={{ padding: 20 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F3F4F6', marginBottom: 4 }}>Skill Progress</div>
                        <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: 16 }}>
                            {data.substream || 'General'} skills
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {data.skills.map(skill => (
                                <div key={skill.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: '0.85rem', color: '#D1D5DB' }}>{skill.name}</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6c63ff' }}>{skill.progress}%</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 3,
                                            width: `${skill.progress}%`,
                                            background: 'var(--gradient-primary)',
                                            transition: 'width 0.6s ease',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Pattern + AI Insight */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    {/* Performance Pattern */}
                    <div className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <span style={{ fontSize: '1.1rem' }}>📈</span>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F3F4F6' }}>Performance Pattern</span>
                        </div>
                        <div style={{
                            padding: '10px 14px', borderRadius: 'var(--radius-md)',
                            background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.12)',
                            marginBottom: 10,
                        }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6c63ff' }}>{data.pattern}</div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6 }}>{data.pattern_detail}</p>
                    </div>

                    {/* AI Insight */}
                    <div className="glass-card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <span style={{ fontSize: '1.1rem' }}>🤖</span>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F3F4F6' }}>AI Insight</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#D1D5DB', lineHeight: 1.7 }}>{data.insight}</p>
                    </div>
                </div>

                {/* Weekly Reflection */}
                <div className="glass-card" style={{ padding: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F3F4F6', marginBottom: 8 }}>📝 Weekly Reflection</div>
                    <p style={{ fontSize: '0.82rem', color: '#9CA3AF', marginBottom: 12 }}>
                        What did you learn this week? What would you improve?
                    </p>
                    <textarea className="input-field" value={reflection} onChange={e => setReflection(e.target.value)}
                        placeholder="Write your reflection..." style={{ height: 80, resize: 'vertical', fontFamily: 'inherit' }} />
                    <button className="btn btn-primary" style={{ marginTop: 10 }} disabled={!reflection.trim()}
                        onClick={async () => {
                            try {
                                await api.submitReflection(reflection);
                                setReflection('');
                                alert('Reflection saved!');
                            } catch { alert('Saved locally.'); setReflection(''); }
                        }}>
                        Save Reflection
                    </button>
                </div>

            </div>
        </div>
    );
}
