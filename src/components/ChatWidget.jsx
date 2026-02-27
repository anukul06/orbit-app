import React, { useState, useRef, useEffect } from 'react';

const quickQuestions = [
    'Which career suits me?',
    'How do I improve consistency?',
    'Is AI better than Web Development?',
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
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const sendMessage = async (text) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setLoading(true);

        try {
            const res = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg }),
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
        try { await fetch('/api/chat/clear', { method: 'POST' }); } catch { }
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

    // Floating button
    if (!open) {
        return (
            <button onClick={() => setOpen(true)} id="chat-toggle-btn" style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
                width: 60, height: 60, borderRadius: '50%',
                background: 'var(--gradient-primary)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(108, 99, 255, 0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                fontSize: '1.6rem', color: 'white',
            }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}>
                💬
            </button>
        );
    }

    // Chat modal
    return (
        <div style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
            width: 400, height: 560,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 30px rgba(108,99,255,0.15)',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '14px 20px',
                background: 'rgba(108, 99, 255, 0.08)',
                borderBottom: '1px solid var(--border-glass)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem',
                    }}>🧠</span>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ORBIT AI</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-success)' }}>● Online</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={clearChat} title="Clear chat" style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-sm)', padding: '4px 10px', cursor: 'pointer',
                        color: 'var(--text-muted)', fontSize: '0.75rem',
                    }}>Clear</button>
                    <button onClick={() => setOpen(false)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', fontSize: '1.2rem', padding: '0 4px',
                    }}>✕</button>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: 16,
                display: 'flex', flexDirection: 'column', gap: 12,
            }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                        <div style={{
                            maxWidth: '82%', padding: '10px 14px',
                            borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                            background: m.role === 'user'
                                ? 'var(--accent-primary)'
                                : 'rgba(255,255,255,0.06)',
                            color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                            fontSize: '0.88rem', lineHeight: 1.6,
                            border: m.role === 'user' ? 'none' : '1px solid var(--border-glass)',
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        }}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '10px 18px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '14px 14px 14px 4px',
                            display: 'flex', gap: 5, alignItems: 'center',
                        }}>
                            {[0, 1, 2].map(i => (
                                <span key={i} style={{
                                    width: 7, height: 7, borderRadius: '50%',
                                    background: 'var(--accent-primary)',
                                    opacity: 0.5,
                                    animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                                }} />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
                <div style={{
                    padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6,
                }}>
                    {quickQuestions.map((q, i) => (
                        <button key={i} onClick={() => sendMessage(q)} style={{
                            padding: '5px 12px', fontSize: '0.75rem',
                            background: 'rgba(108,99,255,0.1)',
                            border: '1px solid rgba(108,99,255,0.2)',
                            borderRadius: 'var(--radius-full)',
                            color: 'var(--accent-primary)', cursor: 'pointer',
                            fontWeight: 500, transition: 'all 0.15s ease',
                        }}>
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div style={{
                padding: 12, borderTop: '1px solid var(--border-glass)',
                display: 'flex', gap: 8,
            }}>
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
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem', outline: 'none',
                    }}
                />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                    id="chat-send-btn" style={{
                        padding: '10px 16px', borderRadius: 'var(--radius-md)',
                        background: input.trim() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontWeight: 600, fontSize: '0.9rem',
                        transition: 'all 0.15s ease',
                    }}>
                    →
                </button>
            </div>

            {/* Typing animation keyframes */}
            <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
        </div>
    );
}
