import React from 'react';

export default function OrbitAnimation() {
    return (
        <div className="orbit-container" style={{
            position: 'relative',
            width: 420,
            height: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {/* Central glow */}
            <div style={{
                position: 'absolute',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                boxShadow: '0 0 60px rgba(108, 99, 255, 0.5), 0 0 120px rgba(108, 99, 255, 0.2)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                color: 'white'
            }}>
                ORBIT
            </div>

            {/* Ring 1 */}
            <div style={{
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: '50%',
                border: '1px solid rgba(108, 99, 255, 0.15)',
                animation: 'orbitRotate 12s linear infinite',
            }}>
                <div style={{
                    position: 'absolute',
                    top: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#6c63ff',
                    boxShadow: '0 0 15px rgba(108, 99, 255, 0.6)',
                    animation: 'orbitRotateReverse 12s linear infinite',
                }} />
            </div>

            {/* Ring 2 */}
            <div style={{
                position: 'absolute',
                width: 270,
                height: 270,
                borderRadius: '50%',
                border: '1px solid rgba(0, 212, 255, 0.12)',
                animation: 'orbitRotateReverse 18s linear infinite',
            }}>
                <div style={{
                    position: 'absolute',
                    top: -5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#00d4ff',
                    boxShadow: '0 0 15px rgba(0, 212, 255, 0.6)',
                    animation: 'orbitRotate 18s linear infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#ff6b9d',
                    boxShadow: '0 0 12px rgba(255, 107, 157, 0.5)',
                    animation: 'orbitRotate 18s linear infinite',
                }} />
            </div>

            {/* Ring 3 */}
            <div style={{
                position: 'absolute',
                width: 370,
                height: 370,
                borderRadius: '50%',
                border: '1px solid rgba(108, 99, 255, 0.08)',
                animation: 'orbitRotate 25s linear infinite',
            }}>
                <div style={{
                    position: 'absolute',
                    top: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--accent-success)',
                    boxShadow: '0 0 10px rgba(0, 230, 118, 0.5)',
                    animation: 'orbitRotateReverse 25s linear infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    right: -4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#ffab40',
                    boxShadow: '0 0 10px rgba(255, 171, 64, 0.5)',
                    animation: 'orbitRotateReverse 25s linear infinite',
                }} />
            </div>
        </div>
    );
}
