import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Settings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({ dark_mode: 1, notifications_enabled: 1, weekly_summary: 0, skill_level: '', hours_per_day: 2, email: '' });
    const [saved, setSaved] = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState('');

    useEffect(() => {
        api.getSettings().then(setSettings).catch(() => navigate('/login'));
    }, []);

    const save = async (updates) => {
        const next = { ...settings, ...updates };
        setSettings(next);
        try {
            await api.updateSettings(next);
            if (updates.dark_mode !== undefined) {
                document.documentElement.setAttribute('data-theme', updates.dark_mode ? 'dark' : 'light');
                localStorage.setItem('orbit-theme', updates.dark_mode ? 'dark' : 'light');
            }
            setSaved('Settings saved ✅');
            setTimeout(() => setSaved(''), 2000);
        } catch { }
    };

    const changePassword = async () => {
        setPwMsg('');
        if (pwForm.new_password.length < 6) { setPwMsg('Password must be 6+ characters'); return; }
        if (pwForm.new_password !== pwForm.confirm) { setPwMsg('Passwords do not match'); return; }
        try {
            await api.changePassword(pwForm.current_password, pwForm.new_password);
            setPwMsg('Password changed ✅');
            setPwForm({ current_password: '', new_password: '', confirm: '' });
        } catch (err) { setPwMsg(err.error || 'Failed'); }
    };

    const deleteAccount = async () => {
        try { await api.deleteAccount(); navigate('/'); } catch { }
    };

    const Toggle = ({ label, checked, onChange, desc }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-glass)' }}>
            <div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{label}</div>
                {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
            </div>
            <button onClick={() => onChange(!checked)} style={{
                width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                background: checked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'background 0.2s',
            }}>
                <span style={{
                    position: 'absolute', top: 3, left: checked ? 24 : 3,
                    width: 20, height: 20, borderRadius: '50%', background: 'white',
                    transition: 'left 0.2s',
                }} />
            </button>
        </div>
    );

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 720, margin: '0 auto' }}>
                <h2 style={{ marginBottom: 4 }}>⚙️ <span className="gradient-text">Settings</span></h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Manage your preferences and account</p>

                {saved && <div style={{ padding: '10px 16px', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 'var(--radius-md)', color: '#00e676', fontSize: '0.88rem', marginBottom: 20 }}>{saved}</div>}

                {/* Appearance */}
                <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                    <div className="section-title" style={{ marginBottom: 8 }}>🌗 Appearance</div>
                    <Toggle label="Dark Mode" checked={!!settings.dark_mode} onChange={v => save({ dark_mode: v ? 1 : 0 })}
                        desc="Switch between dark and light themes" />
                </div>

                {/* Notifications */}
                <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                    <div className="section-title" style={{ marginBottom: 8 }}>🔔 Notifications</div>
                    <Toggle label="Task Reminders" checked={!!settings.notifications_enabled}
                        onChange={v => save({ notifications_enabled: v ? 1 : 0 })}
                        desc="Get reminders for pending tasks" />
                    <Toggle label="Weekly Performance Summary" checked={!!settings.weekly_summary}
                        onChange={v => save({ weekly_summary: v ? 1 : 0 })}
                        desc="Receive weekly progress report" />
                </div>

                {/* Learning Preferences */}
                <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                    <div className="section-title" style={{ marginBottom: 16 }}>🎯 Learning Preferences</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="input-label">Skill Level</label>
                            <select className="input-field" value={settings.skill_level} onChange={e => save({ skill_level: e.target.value })}>
                                <option value="">Select</option>
                                {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Hours per Day</label>
                            <select className="input-field" value={settings.hours_per_day} onChange={e => save({ hours_per_day: Number(e.target.value) })}>
                                {[1, 2, 3, 4, 5].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Account */}
                <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                    <div className="section-title" style={{ marginBottom: 16 }}>🔐 Account</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>Email: {settings.email}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <input type="password" className="input-field" placeholder="Current password"
                            value={pwForm.current_password} onChange={e => setPwForm(p => ({ ...p, current_password: e.target.value }))} />
                        <input type="password" className="input-field" placeholder="New password"
                            value={pwForm.new_password} onChange={e => setPwForm(p => ({ ...p, new_password: e.target.value }))} />
                        <input type="password" className="input-field" placeholder="Confirm"
                            value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
                    </div>
                    {pwMsg && <div style={{ fontSize: '0.85rem', marginBottom: 12, color: pwMsg.includes('✅') ? '#00e676' : '#ff5252' }}>{pwMsg}</div>}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-primary" onClick={changePassword} disabled={!pwForm.current_password}>Change Password</button>
                        <button className="btn btn-secondary" onClick={() => { api.logout(); navigate('/login'); }}>Logout</button>
                        <button onClick={() => setShowDelete(true)} style={{
                            padding: '10px 20px', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
                            borderRadius: 'var(--radius-md)', color: '#ff5252', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                        }}>Delete Account</button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDelete && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                        <div className="glass-card" style={{ padding: 32, maxWidth: 400, textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
                            <h3 style={{ marginBottom: 8 }}>Delete Account?</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>This will permanently delete all your data. This cannot be undone.</p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
                                <button onClick={deleteAccount} style={{
                                    padding: '10px 24px', background: '#ff5252', border: 'none',
                                    borderRadius: 'var(--radius-md)', color: 'white', cursor: 'pointer', fontWeight: 600,
                                }}>Delete Everything</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
