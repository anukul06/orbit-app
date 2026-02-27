import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import CircularProgress from '../components/CircularProgress';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend);

const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Engagement Score',
            data: [65, 78, 72, 85, 60, 90, 82],
            fill: true,
            backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 250);
                gradient.addColorStop(0, 'rgba(108, 99, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(108, 99, 255, 0)');
                return gradient;
            },
            borderColor: '#6c63ff',
            borderWidth: 2,
            pointBackgroundColor: '#6c63ff',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
        },
    ],
};

const completionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
        {
            label: 'Completed',
            data: [100, 50, 0, 0],
            backgroundColor: 'rgba(108, 99, 255, 0.7)',
            borderColor: '#6c63ff',
            borderWidth: 0,
            borderRadius: 6,
        },
        {
            label: 'Remaining',
            data: [0, 50, 100, 100],
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 0,
            borderRadius: 6,
        },
    ],
};

const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
            backgroundColor: 'rgba(15, 20, 40, 0.95)',
            borderColor: 'rgba(108, 99, 255, 0.3)',
            borderWidth: 1,
            titleColor: '#e8eaed',
            bodyColor: '#9aa0b0',
            padding: 12,
            cornerRadius: 8,
        },
    },
    scales: {
        x: {
            ticks: { color: '#5a6070', font: { size: 12 } },
            grid: { color: 'rgba(255,255,255,0.03)' },
            border: { display: false },
        },
        y: {
            ticks: { color: '#5a6070', font: { size: 12 } },
            grid: { color: 'rgba(255,255,255,0.03)' },
            border: { display: false },
            beginAtZero: true,
            max: 100,
        },
    },
});

const stackedOptions = {
    ...chartOptions(''),
    scales: {
        ...chartOptions('').scales,
        x: { ...chartOptions('').scales.x, stacked: true },
        y: { ...chartOptions('').scales.y, stacked: true },
    },
};

const skillBars = [
    { name: 'Python', level: 82, color: '#6c63ff' },
    { name: 'Mathematics', level: 55, color: '#00d4ff' },
    { name: 'Data Analysis', level: 68, color: '#ff6b9d' },
    { name: 'Problem Solving', level: 90, color: '#00e676' },
    { name: 'ML Concepts', level: 42, color: '#ffab40' },
];

export default function Insights() {
    const [reflection, setReflection] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (reflection.trim()) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setReflection('');
        }
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
                        <h2 style={{ marginBottom: 4 }}>Insights & <span className="gradient-text">Reflection</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Review your progress, reflect, and adapt</p>
                    </div>
                    <CircularProgress value={72} size={110} label="Clarity Index" />
                </div>

                {/* Main Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                    {/* Engagement Trend */}
                    <div className="glass-card animate-fade-in delay-100" style={{ padding: 28 }}>
                        <h4 style={{ marginBottom: 20, fontSize: '1rem' }}>📈 Engagement Trend</h4>
                        <div style={{ height: 260 }}>
                            <Line data={engagementData} options={chartOptions('Engagement')} />
                        </div>
                    </div>

                    {/* Task Completion Rate */}
                    <div className="glass-card animate-fade-in delay-200" style={{ padding: 28 }}>
                        <h4 style={{ marginBottom: 20, fontSize: '1rem' }}>📊 Task Completion Rate</h4>
                        <div style={{ height: 260 }}>
                            <Bar data={completionData} options={stackedOptions} />
                        </div>
                    </div>
                </div>

                {/* Second Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                    {/* Weekly Reflection */}
                    <div className="glass-card animate-fade-in delay-300" style={{ padding: 28 }}>
                        <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>✍️ Weekly Reflection</h4>
                        <p style={{
                            color: 'var(--text-secondary)', fontSize: '0.9rem',
                            marginBottom: 16, lineHeight: 1.6,
                        }}>
                            Share your thoughts on this week's journey. What went well? What needs improvement?
                        </p>
                        <textarea
                            className="input-field"
                            rows={5}
                            placeholder="Write your weekly reflection here..."
                            value={reflection}
                            onChange={e => setReflection(e.target.value)}
                            style={{
                                resize: 'vertical',
                                marginBottom: 16,
                                minHeight: 120,
                            }}
                            id="reflection-input"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                id="submit-reflection"
                            >
                                Submit Reflection →
                            </button>
                            {submitted && (
                                <span className="animate-fade-in" style={{
                                    color: 'var(--accent-success)', fontSize: '0.9rem', fontWeight: 500,
                                }}>
                                    ✓ Reflection submitted successfully!
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Skill Progress */}
                    <div className="glass-card animate-fade-in delay-400" style={{ padding: 28 }}>
                        <h4 style={{ marginBottom: 20, fontSize: '1rem' }}>🎯 Skill Progress</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {skillBars.map((skill, i) => (
                                <div key={i}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        marginBottom: 8, fontSize: '0.9rem',
                                    }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{skill.name}</span>
                                        <span style={{ color: skill.color, fontWeight: 600 }}>{skill.level}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{
                                            width: `${skill.level}%`,
                                            background: skill.color,
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Suggested Adjustment */}
                <div className="glass-card animate-fade-in delay-500" style={{
                    padding: 32,
                    border: '1px solid rgba(108, 99, 255, 0.2)',
                    background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.06) 0%, rgba(0, 212, 255, 0.03) 100%)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 'var(--radius-md)',
                            background: 'rgba(108, 99, 255, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', flexShrink: 0,
                        }}>🧠</div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ marginBottom: 8 }}>AI Stream Adjustment Suggestion</h4>
                            <p style={{
                                color: 'var(--text-secondary)', fontSize: '0.95rem',
                                lineHeight: 1.7, marginBottom: 16,
                            }}>
                                Based on your engagement patterns and skill progression, your Clarity Index has improved by
                                <span className="gradient-text" style={{ fontWeight: 700 }}> +12 points</span> this week.
                                Your strong performance in Python and problem-solving suggests you may excel in
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}> Machine Learning</span>.
                                Consider exploring ML-specific modules to maximize your growth trajectory.
                            </p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-primary btn-sm">Explore ML Path →</button>
                                <button className="btn btn-secondary btn-sm">Dismiss</button>
                            </div>
                        </div>
                        <CircularProgress value={72} size={80} label="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
