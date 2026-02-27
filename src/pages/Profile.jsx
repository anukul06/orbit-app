import React from 'react';
import { useNavigate } from 'react-router-dom';

const user = {
    name: '{{ user.name }}',
    email: '{{ user.email }}',
    college: '{{ user.college }}',
    field: '{{ user.field }}',
    substream: '{{ user.substream }}',
    skillLevel: '{{ user.skill_level }}',
    timePerDay: '{{ user.time_per_day }}',
    year: '3rd Year',
    degree: 'B.Tech',
    age: '21',
};

export default function Profile() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 900, margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 36,
                }}>
                    <div>
                        <h2 style={{ marginBottom: 4 }}>My <span className="gradient-text">Profile</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage your account and preferences</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => navigate('/complete-profile')} id="edit-profile-btn">
                        ✏️ Edit Profile
                    </button>
                </div>

                {/* Profile Avatar */}
                <div className="glass-card" style={{
                    padding: 32, marginBottom: 24,
                    display: 'flex', alignItems: 'center', gap: 24,
                }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.8rem', fontWeight: 700, color: 'white',
                        fontFamily: 'var(--font-display)',
                    }}>
                        {user.name.startsWith('{{') ? 'U' : user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ marginBottom: 4 }}>{user.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{user.email}</p>
                    </div>
                </div>

                {/* Two column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* Personal Info */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Personal Information</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <ProfileRow label="Full Name" value={user.name} />
                            <ProfileRow label="Email" value={user.email} />
                            <ProfileRow label="Age" value={user.age} />
                            <ProfileRow label="College" value={user.college} />
                            <ProfileRow label="Year of Study" value={user.year} />
                            <ProfileRow label="Degree" value={user.degree} />
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Academic Info & Preferences</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <ProfileRow label="Field of Study" value={user.field} />
                            <ProfileRow label="Substream" value={user.substream} />
                            <ProfileRow label="Skill Level" value={user.skillLevel} />
                            <ProfileRow label="Daily Time Commitment" value={user.timePerDay} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileRow({ label, value }) {
    return (
        <div>
            <div style={{
                fontSize: '0.78rem', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4
            }}>{label}</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {value}
            </div>
        </div>
    );
}
