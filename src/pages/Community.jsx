import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const fields = ['', 'Computer Science', 'Civil Engineering', 'Medical', 'Commerce', 'Arts'];

export default function Community() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [expandedPost, setExpandedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const filterRef = useRef(filter);
    const expandedRef = useRef(null);

    // Keep refs in sync for polling callbacks
    useEffect(() => { filterRef.current = filter; }, [filter]);
    useEffect(() => { expandedRef.current = expandedPost; }, [expandedPost]);

    // Initial load + polling every 4 seconds
    useEffect(() => {
        loadPosts();
        const interval = setInterval(() => {
            silentLoadPosts();
            // Also refresh comments if a post is expanded
            if (expandedRef.current) {
                api.getPostComments(expandedRef.current)
                    .then(data => setComments(data.comments || []))
                    .catch(() => { });
            }
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Reload when filter changes
    useEffect(() => { loadPosts(); }, [filter]);

    const loadPosts = async () => {
        try {
            const data = await api.getCommunityPosts(filter);
            setPosts(data.posts || []);
        } catch { navigate('/login'); }
        finally { setLoading(false); }
    };

    // Silent reload — no loading state, no redirect on error
    const silentLoadPosts = async () => {
        try {
            const data = await api.getCommunityPosts(filterRef.current);
            setPosts(data.posts || []);
        } catch { }
    };

    const createPost = async () => {
        if (!newPost.title.trim()) return;
        await api.createCommunityPost(newPost);
        setShowCreate(false);
        setNewPost({ title: '', content: '' });
        loadPosts(); // Instant update after creation
    };

    const toggleLike = async (postId) => {
        const data = await api.togglePostLike(postId);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes, liked: data.liked } : p));
    };

    const openComments = async (postId) => {
        if (expandedPost === postId) {
            setExpandedPost(null); // Toggle collapse
            setComments([]);
            return;
        }
        setExpandedPost(postId);
        const data = await api.getPostComments(postId);
        setComments(data.comments || []);
    };

    const addComment = async () => {
        if (!newComment.trim() || !expandedPost) return;
        await api.addPostComment(expandedPost, newComment);
        setNewComment('');
        // Immediately refresh comments
        const data = await api.getPostComments(expandedPost);
        setComments(data.comments || []);
        // Update comment count on post
        setPosts(prev => prev.map(p => p.id === expandedPost ? { ...p, comments_count: data.comments.length } : p));
    };

    const timeAgo = (ts) => {
        if (!ts) return '';
        const diff = (Date.now() - new Date(ts + 'Z').getTime()) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="page-wrapper">
            <div className="bg-grid" />
            <div className="page-container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 800, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <h2 style={{ marginBottom: 4 }}>🧑‍🤝‍🧑 <span className="gradient-text">Community</span></h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Share, learn, and connect with peers</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Post</button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                    {fields.map(f => (
                        <button key={f || 'all'} onClick={() => setFilter(f)} style={{
                            padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600,
                            border: '1px solid', cursor: 'pointer',
                            background: filter === f ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
                            borderColor: filter === f ? 'var(--accent-primary)' : 'var(--border-glass)',
                            color: filter === f ? 'white' : 'var(--text-secondary)',
                        }}>{f || 'All Fields'}</button>
                    ))}
                </div>

                {/* Create Post */}
                {showCreate && (
                    <div className="glass-card" style={{ padding: 24, marginBottom: 20, border: '1px solid var(--border-accent)' }}>
                        <input type="text" className="input-field" placeholder="Post title..." value={newPost.title}
                            onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} style={{ marginBottom: 12 }} />
                        <textarea className="input-field" placeholder="Share your thoughts, questions, or insights..."
                            value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                            style={{ height: 80, resize: 'vertical', fontFamily: 'inherit' }} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button className="btn btn-primary" onClick={createPost} disabled={!newPost.title.trim()}>Post</button>
                            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Posts Feed */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Loading...</p>
                ) : posts.length === 0 ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No posts yet. Be the first to share! 🚀</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {posts.map(post => (
                            <div key={post.id} className="glass-card" style={{ padding: 20 }}>
                                {/* Post Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.85rem', fontWeight: 700, color: 'white',
                                    }}>{(post.author || 'U')[0].toUpperCase()}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F3F4F6' }}>{post.author}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{timeAgo(post.created_at)}</div>
                                    </div>
                                    {post.field && (
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem',
                                            background: 'rgba(108,99,255,0.1)', color: 'var(--accent-primary)', fontWeight: 600,
                                        }}>{post.stream || post.field}</span>
                                    )}
                                </div>

                                {/* Post Body */}
                                <h3 style={{ fontSize: '1.05rem', marginBottom: 6, color: '#F9FAFB' }}>{post.title}</h3>
                                {post.content && <p style={{ color: '#D1D5DB', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 14 }}>{post.content}</p>}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--border-glass)', paddingTop: 12 }}>
                                    <button onClick={() => toggleLike(post.id)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                        color: post.liked ? '#ff6b9d' : '#9CA3AF', fontSize: '0.85rem', fontWeight: 500,
                                    }}>{post.liked ? '❤️' : '🤍'} {post.likes}</button>
                                    <button onClick={() => openComments(post.id)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                        color: expandedPost === post.id ? 'var(--accent-primary)' : '#9CA3AF', fontSize: '0.85rem', fontWeight: 500,
                                    }}>💬 {post.comments_count || 0} Comment{(post.comments_count || 0) !== 1 ? 's' : ''}</button>
                                </div>

                                {/* Comments Section */}
                                {expandedPost === post.id && (
                                    <div style={{ marginTop: 14, borderTop: '1px solid var(--border-glass)', paddingTop: 14 }}>
                                        {comments.length === 0 ? (
                                            <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 12 }}>No comments yet. Be the first!</p>
                                        ) : (
                                            comments.map(c => (
                                                <div key={c.id} style={{
                                                    display: 'flex', gap: 10, marginBottom: 12,
                                                    padding: '10px 12px', borderRadius: 'var(--radius-md)',
                                                    background: 'rgba(255,255,255,0.02)', marginLeft: 8,
                                                }}>
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                        background: 'rgba(108,99,255,0.2)', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)',
                                                    }}>
                                                        {(c.author || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#F3F4F6' }}>{c.author}</span>
                                                        <span style={{ fontSize: '0.7rem', color: '#6B7280', marginLeft: 8 }}>{timeAgo(c.created_at)}</span>
                                                        <p style={{ fontSize: '0.88rem', color: '#D1D5DB', marginTop: 3, lineHeight: 1.5 }}>{c.comment}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}

                                        {/* Comment Input */}
                                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                            <input type="text" className="input-field" placeholder="Write a comment..."
                                                value={newComment} onChange={e => setNewComment(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && addComment()}
                                                style={{ flex: 1, margin: 0 }} />
                                            <button className="btn btn-primary" onClick={addComment}
                                                style={{ padding: '8px 16px' }} disabled={!newComment.trim()}>
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
