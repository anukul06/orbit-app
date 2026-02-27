import React, { useEffect, useState } from 'react';

export default function CircularProgress({ value = 0, size = 140, strokeWidth = 10, label = '', color = 'url(#gradient)' }) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedValue / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(value), 200);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="circular-progress" style={{ width: size, height: size, position: 'relative' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6c63ff" />
                        <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                </defs>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </svg>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: size * 0.22,
                    fontWeight: 800,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1
                }}>
                    {animatedValue}
                </div>
                {label && (
                    <div style={{
                        fontSize: size * 0.09,
                        color: 'var(--text-secondary)',
                        marginTop: 4,
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {label}
                    </div>
                )}
            </div>
        </div>
    );
}
