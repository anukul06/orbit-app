import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const degreeMap = {
    'B.Tech': {
        'Computer Science': ['Data Science', 'Artificial Intelligence', 'Machine Learning', 'Web Development', 'Cybersecurity'],
        'Civil Engineering': ['Structural Engineering', 'Geotechnical', 'Environmental Engineering', 'Transportation', 'Urban Planning'],
        'Mechanical Engineering': ['Thermodynamics', 'Robotics', 'Automobile', 'Manufacturing', 'Aerospace'],
        'Electrical Engineering': ['Power Systems', 'Electronics', 'Signal Processing', 'VLSI', 'Control Systems'],
    },
    'MBBS': {
        'Clinical Medicine': ['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Psychiatry'],
        'Surgery': ['General Surgery', 'Orthopedics', 'Neurosurgery', 'ENT', 'Ophthalmology'],
        'Diagnostics': ['Radiology', 'Pathology', 'Microbiology', 'Biochemistry', 'Forensic Medicine'],
    },
    'B.Com': {
        'Finance': ['Investment Banking', 'Corporate Finance', 'Risk Management', 'Financial Planning'],
        'Accounting': ['Taxation', 'Auditing', 'Cost Accounting', 'Financial Reporting'],
        'Marketing': ['Digital Marketing', 'Brand Management', 'Market Research', 'Advertising'],
    },
    'B.A': {
        'Economics': ['Behavioral Economics', 'Econometrics', 'International Trade', 'Public Finance'],
        'Psychology': ['Clinical Psychology', 'Cognitive Science', 'Organizational Behavior', 'Counseling'],
        'Political Science': ['Public Policy', 'International Relations', 'Governance', 'Constitutional Law'],
    },
    'B.Sc': {
        'Physics': ['Quantum Mechanics', 'Astrophysics', 'Optics', 'Nuclear Physics'],
        'Mathematics': ['Applied Math', 'Statistics', 'Algebra', 'Computational Math'],
        'Biology': ['Genetics', 'Ecology', 'Microbiology', 'Biotechnology'],
    },
    'BBA': {
        'Management': ['Operations', 'Strategic Management', 'Supply Chain', 'Project Management'],
        'Entrepreneurship': ['Startup Management', 'Venture Capital', 'Innovation', 'Social Enterprise'],
        'HR': ['Talent Management', 'Organizational Development', 'Labor Relations', 'Compensation'],
    },
    'Other': {
        'General': ['Research', 'Interdisciplinary Studies', 'Liberal Arts', 'Professional Development'],
    },
};

const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
const degreeTypes = Object.keys(degreeMap);

export default function CompleteProfile() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: '', age: '', college: '', year: '', degree: '',
        field: '', substream: '', skillLevel: '', hoursPerDay: 2,
    });

    const update = (key, val) => {
        setForm(prev => {
            const next = { ...prev, [key]: val };
            if (key === 'degree') { next.field = ''; next.substream = ''; }
            if (key === 'field') { next.substream = ''; }
            return next;
        });
    };

    const currentFields = form.degree ? Object.keys(degreeMap[form.degree] || {}) : [];
    const currentSubstreams = (form.degree && form.field) ? (degreeMap[form.degree]?.[form.field] || []) : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.updateProfile(form);
            navigate('/dashboard');
        } catch (err) {
            alert(err.error || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div className="navbar-logo" style={{ fontSize: '1.6rem', marginBottom: 12 }}>ORBIT</div>
                    <h2 style={{ marginBottom: 6 }}>Complete Your <span className="gradient-text">Profile</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Help us personalize your learning journey</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Personal Information</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <label className="input-label">Full Name</label>
                                <input type="text" className="input-field" placeholder="Your full name"
                                    value={form.name} onChange={e => update('name', e.target.value)} id="name-input" />
                            </div>
                            <div>
                                <label className="input-label">Age</label>
                                <input type="number" className="input-field" placeholder="e.g. 20"
                                    value={form.age} onChange={e => update('age', e.target.value)} min="15" max="60" id="age-input" />
                            </div>
                            <div>
                                <label className="input-label">College Name</label>
                                <input type="text" className="input-field" placeholder="Your college / university"
                                    value={form.college} onChange={e => update('college', e.target.value)} id="college-input" />
                            </div>
                            <div>
                                <label className="input-label">Year of Study</label>
                                <select className="input-field" value={form.year} onChange={e => update('year', e.target.value)} id="year-input">
                                    <option value="">Select Year</option>
                                    {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y}{['st', 'nd', 'rd', 'th', 'th'][y - 1]} Year</option>)}
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="input-label">Degree Type</label>
                                <select className="input-field" value={form.degree} onChange={e => update('degree', e.target.value)} id="degree-input">
                                    <option value="">Select Degree</option>
                                    {degreeTypes.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Educational Information</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                            <div>
                                <label className="input-label">Field of Study</label>
                                <select className="input-field" value={form.field} onChange={e => update('field', e.target.value)}
                                    id="field-input" disabled={!form.degree}>
                                    <option value="">{form.degree ? 'Select Field' : 'Select degree first'}</option>
                                    {currentFields.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Substream</label>
                                <select className="input-field" value={form.substream} onChange={e => update('substream', e.target.value)}
                                    id="substream-input" disabled={!form.field}>
                                    <option value="">{form.field ? 'Select Substream' : 'Select field first'}</option>
                                    {currentSubstreams.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Skill Level</label>
                                <select className="input-field" value={form.skillLevel} onChange={e => update('skillLevel', e.target.value)} id="skill-input">
                                    <option value="">Select Level</option>
                                    {skillLevels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Time Allocation</div>
                        <label className="input-label" style={{ marginBottom: 12 }}>
                            Hours per day: <span className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{form.hoursPerDay}h</span>
                        </label>
                        <input type="range" min="1" max="5" step="1" value={form.hoursPerDay}
                            onChange={e => update('hoursPerDay', Number(e.target.value))} id="hours-slider"
                            style={{
                                width: '100%', height: 6, appearance: 'none', WebkitAppearance: 'none',
                                background: `linear-gradient(to right, #6c63ff 0%, #6c63ff ${(form.hoursPerDay - 1) * 25}%, rgba(255,255,255,0.1) ${(form.hoursPerDay - 1) * 25}%)`,
                                borderRadius: 3, outline: 'none', cursor: 'pointer',
                            }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {[1, 2, 3, 4, 5].map(h => <span key={h}>{h} hour{h > 1 ? 's' : ''}</span>)}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', opacity: saving ? 0.7 : 1 }}
                        id="generate-plan-btn" disabled={saving}>
                        {saving ? 'Saving...' : 'Generate My Career Plan →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
