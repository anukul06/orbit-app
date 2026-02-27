import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fields = [
    'Computer Science', 'Civil Engineering', 'Medical', 'Commerce', 'Arts',
];

const substreamMap = {
    'Computer Science': ['AI', 'Data Science', 'Machine Learning', 'Web Development', 'Cybersecurity'],
    'Civil Engineering': ['Structural', 'Environmental', 'Transportation', 'Geotechnical', 'Urban Planning'],
    'Medical': ['General Medicine', 'Surgery', 'Pharmacy', 'Biotechnology', 'Nursing'],
    'Commerce': ['Accounting', 'Finance', 'Marketing', 'Economics', 'Business Analytics'],
    'Arts': ['Design', 'Literature', 'Media', 'Performing Arts', 'Humanities'],
};

const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
const degreeTypes = ['B.Tech', 'B.Sc', 'B.Com', 'B.A', 'MBBS', 'BBA', 'Other'];

export default function CompleteProfile() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        age: '',
        college: '',
        year: '',
        degree: '',
        field: '',
        substream: '',
        skillLevel: '',
        hoursPerDay: 2,
    });

    const update = (key, val) => {
        setForm(prev => {
            const next = { ...prev, [key]: val };
            if (key === 'field') next.substream = '';
            return next;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div style={{
                maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px',
                position: 'relative', zIndex: 1,
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div className="navbar-logo" style={{ fontSize: '1.6rem', marginBottom: 12 }}>ORBIT</div>
                    <h2 style={{ marginBottom: 6 }}>Complete Your <span className="gradient-text">Profile</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Help us personalize your learning journey
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Personal Information</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <label className="input-label">Age</label>
                                <input type="number" className="input-field" placeholder="e.g. 20"
                                    value={form.age} onChange={e => update('age', e.target.value)}
                                    min="15" max="60" id="age-input" />
                            </div>
                            <div>
                                <label className="input-label">College Name</label>
                                <input type="text" className="input-field" placeholder="Your college / university"
                                    value={form.college} onChange={e => update('college', e.target.value)}
                                    id="college-input" />
                            </div>
                            <div>
                                <label className="input-label">Year of Study</label>
                                <select className="input-field" value={form.year}
                                    onChange={e => update('year', e.target.value)} id="year-input">
                                    <option value="">Select Year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                    <option value="5">5th Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Degree Type</label>
                                <select className="input-field" value={form.degree}
                                    onChange={e => update('degree', e.target.value)} id="degree-input">
                                    <option value="">Select Degree</option>
                                    {degreeTypes.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Educational Info */}
                    <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Educational Information</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                            <div>
                                <label className="input-label">Field of Study</label>
                                <select className="input-field" value={form.field}
                                    onChange={e => update('field', e.target.value)} id="field-input">
                                    <option value="">Select Field</option>
                                    {fields.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Substream</label>
                                <select className="input-field" value={form.substream}
                                    onChange={e => update('substream', e.target.value)} id="substream-input"
                                    disabled={!form.field}>
                                    <option value="">Select Substream</option>
                                    {(substreamMap[form.field] || []).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Skill Level</label>
                                <select className="input-field" value={form.skillLevel}
                                    onChange={e => update('skillLevel', e.target.value)} id="skill-input">
                                    <option value="">Select Level</option>
                                    {skillLevels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Time Allocation */}
                    <div className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
                        <div className="section-title" style={{ marginBottom: 20 }}>Time Allocation</div>
                        <div>
                            <label className="input-label" style={{ marginBottom: 12 }}>
                                Hours per day: <span className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{form.hoursPerDay}h</span>
                            </label>
                            <input
                                type="range" min="1" max="5" step="1"
                                value={form.hoursPerDay}
                                onChange={e => update('hoursPerDay', Number(e.target.value))}
                                id="hours-slider"
                                style={{
                                    width: '100%', height: 6, appearance: 'none', WebkitAppearance: 'none',
                                    background: `linear-gradient(to right, #6c63ff 0%, #6c63ff ${(form.hoursPerDay - 1) * 25}%, rgba(255,255,255,0.1) ${(form.hoursPerDay - 1) * 25}%)`,
                                    borderRadius: 3, outline: 'none', cursor: 'pointer',
                                }}
                            />
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)',
                            }}>
                                <span>1 hour</span>
                                <span>2 hours</span>
                                <span>3 hours</span>
                                <span>4 hours</span>
                                <span>5 hours</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}
                        id="generate-plan-btn">
                        Generate My Career Plan →
                    </button>
                </form>
            </div>
        </div>
    );
}
