import React, { useState, useRef, useEffect } from 'react';

const quickQuestions = [
    'Which career suits me?',
    'How do I improve consistency?',
    'Explain my current roadmap',
    'Suggest resources for beginners',
];

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm ORBIT AI, your career mentor. Ask me anything about careers, learning, or your roadmap! 🚀" },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [attachment, setAttachment] = useState(null); // { name, type, preview }
    const bottomRef = useRef(null);
    const fileRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const sendMessage = async (text) => {
        const msg = (text || input).trim();
        if (!msg && !attachment) return;
        if (loading) return;

        // Build user message
        let userContent = msg;
        let attachContext = '';
        if (attachment) {
            userContent = msg ? `${msg}\n📎 ${attachment.name}` : `📎 ${attachment.name}`;
            attachContext = `\n[User attached file: ${attachment.name} (${attachment.type}). Acknowledge the upload and provide guidance based on the filename context.]`;
        }

        setInput('');
        setAttachment(null);
        setMessages(prev => [...prev, { role: 'user', content: userContent }]);
        setLoading(true);

        try {
            const res = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message: (msg || `Uploaded file: ${attachment?.name}`) + attachContext }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply || data.error || 'Something went wrong.',
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠ Could not reach the server. Please try again.',
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        try { await fetch('/api/chat/clear', { method: 'POST', credentials: 'include' }); } catch { }
        setMessages([
            { role: 'assistant', content: "Chat cleared! How can I help you? 🚀" },
        ]);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const isImage = file.type.startsWith('image/');
        const att = { name: file.name, type: file.type, preview: null };
        if (isImage) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                att.preview = ev.target.result;
                setAttachment({ ...att });
            };
            reader.readAsDataURL(file);
        } else {
            setAttachment(att);
        }
        e.target.value = '';
    };

    const fileIcon = (type) => {
        if (type?.startsWith('image/')) return '🖼️';
        if (type?.includes('pdf')) return '📄';
        if (type?.includes('text')) return '📝';
        return '📎';
    };

    // Floating button
    if (!open) {
        return (
            <button onClick={() => setOpen(true)} id="chat-toggle-btn" style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
                width: 62, height: 62, borderRadius: '50%',
                background: 'var(--gradient-primary)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 28px rgba(108, 99, 255, 0.5), 0 0 40px rgba(108, 99, 255, 0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                fontSize: '1.6rem', color: 'white',
                animation: 'chatGlow 2s ease-in-out infinite',
            }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                🤖
                <style>{`
                    @keyframes chatGlow {
                        0%, 100% { box-shadow: 0 4px 28px rgba(108,99,255,0.5), 0 0 40px rgba(108,99,255,0.15); }
                        50% { box-shadow: 0 4px 36px rgba(108,99,255,0.7), 0 0 60px rgba(108,99,255,0.3); }
                    }
                `}</style>
            </button>
        );
    }

    // Chat modal
    return (
        <div style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
            width: 420, height: 580,
            background: '#0d1117',
            border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: 20,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 12px 48px rgba(0,0,0,0.7), 0 0 40px rgba(108,99,255,0.12)',
            overflow: 'hidden',
            animation: 'chatOpen 0.25s ease-out',
        }}>
            {/* Header */}
            <div style={{
                padding: '14px 18px',
                background: 'linear-gradient(180deg, rgba(108,99,255,0.12) 0%, rgba(108,99,255,0.03) 100%)',
                borderBottom: '1px solid rgba(108,99,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', boxShadow: '0 2px 12px rgba(108,99,255,0.4)',
                    }}>🧠</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F3F4F6' }}>ORBIT AI</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem' }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: '50%', background: '#00e676',
                                display: 'inline-block', boxShadow: '0 0 6px rgba(0,230,118,0.6)',
                            }} />
                            <span style={{ color: '#00e676' }}>Online</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={clearChat} title="Clear chat" style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
                        color: '#6B7280', fontSize: '0.72rem', fontWeight: 500,
                        transition: 'all 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                        🗑 Clear
                    </button>
                    <button onClick={() => setOpen(false)} style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
                        color: '#9CA3AF', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,82,82,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                        ✕
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: 10,
            }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                        animation: 'msgFade 0.3s ease-out',
                    }}>
                        {m.role === 'assistant' && (
                            <div style={{
                                width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginRight: 8, marginTop: 2,
                                background: 'rgba(108,99,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem',
                            }}>🧠</div>
                        )}
                        <div style={{
                            maxWidth: '78%', padding: '10px 14px',
                            borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: m.role === 'user'
                                ? 'linear-gradient(135deg, #6c63ff 0%, #5a52d4 100%)'
                                : 'rgba(255,255,255,0.05)',
                            color: m.role === 'user' ? 'white' : '#D1D5DB',
                            fontSize: '0.86rem', lineHeight: 1.65,
                            border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            boxShadow: m.role === 'user' ? '0 2px 12px rgba(108,99,255,0.3)' : 'none',
                        }}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, animation: 'msgFade 0.3s ease-out' }}>
                        <div style={{
                            width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(108,99,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem',
                        }}>🧠</div>
                        <div style={{
                            padding: '10px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '16px 16px 16px 4px',
                            display: 'flex', gap: 6, alignItems: 'center',
                        }}>
                            <span style={{ fontSize: '0.78rem', color: '#9CA3AF', marginRight: 4 }}>ORBIT AI is thinking</span>
                            {[0, 1, 2].map(i => (
                                <span key={i} style={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: '#6c63ff',
                                    animation: `typingDot 1.4s ease-in-out ${i * 0.2}s infinite`,
                                }} />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Quick Questions — only on first view */}
            {messages.length <= 1 && (
                <div style={{
                    padding: '0 14px 8px', display: 'flex', flexWrap: 'wrap', gap: 6,
                }}>
                    {quickQuestions.map((q, i) => (
                        <button key={i} onClick={() => sendMessage(q)} style={{
                            padding: '5px 12px', fontSize: '0.73rem',
                            background: 'rgba(108,99,255,0.08)',
                            border: '1px solid rgba(108,99,255,0.2)',
                            borderRadius: 20,
                            color: '#6c63ff', cursor: 'pointer',
                            fontWeight: 500, transition: 'all 0.15s ease',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.18)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.08)'; }}>
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Attachment Preview */}
            {attachment && (
                <div style={{
                    padding: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(108,99,255,0.04)',
                }}>
                    {attachment.preview ? (
                        <img src={attachment.preview} alt="preview" style={{
                            width: 36, height: 36, borderRadius: 6, objectFit: 'cover',
                            border: '1px solid rgba(108,99,255,0.2)',
                        }} />
                    ) : (
                        <span style={{ fontSize: '1.2rem' }}>{fileIcon(attachment.type)}</span>
                    )}
                    <span style={{ flex: 1, fontSize: '0.78rem', color: '#D1D5DB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {attachment.name}
                    </span>
                    <button onClick={() => setAttachment(null)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#ff5252', fontSize: '0.85rem', padding: '2px 6px',
                    }}>✕</button>
                </div>
            )}

            {/* Input */}
            <div style={{
                padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: 8, alignItems: 'center',
            }}>
                {/* Attach button */}
                <button onClick={() => fileRef.current?.click()} title="Attach file" style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', color: '#9CA3AF',
                    transition: 'all 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.15)'; e.currentTarget.style.color = '#6c63ff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#9CA3AF'; }}>
                    +
                </button>
                <input type="file" ref={fileRef} hidden onChange={handleFile}
                    accept="image/png,image/jpeg,image/gif,application/pdf,.txt,.csv,.doc,.docx" />

                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask ORBIT AI..."
                    disabled={loading}
                    id="chat-input"
                    style={{
                        flex: 1, padding: '10px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        color: '#F3F4F6',
                        fontSize: '0.86rem', outline: 'none',
                        transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(108,99,255,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />

                {/* Send button */}
                <button onClick={() => sendMessage()} disabled={loading || (!input.trim() && !attachment)}
                    id="chat-send-btn" style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        background: (input.trim() || attachment) ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontWeight: 700, fontSize: '1.1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: (input.trim() || attachment) ? '0 2px 12px rgba(108,99,255,0.4)' : 'none',
                    }}
                    onMouseEnter={e => { if (input.trim() || attachment) e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
                    ↑
                </button>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes typingDot {
                    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
                    30% { opacity: 1; transform: translateY(-3px); }
                }
                @keyframes chatOpen {
                    from { opacity: 0; transform: translateY(16px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes msgFade {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
