/**
 * ORBIT — API Utility
 * Centralized fetch wrapper. Vite proxy forwards /api/* to Flask :5000.
 */

const API = '/api';

async function request(endpoint, options = {}) {
    const url = `${API}${endpoint}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
    };
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) throw { status: res.status, ...data };
    return data;
}

export const api = {
    // Auth
    signup: (email, password) => request('/auth/signup', { method: 'POST', body: { email, password } }),
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    checkSession: () => request('/auth/session'),
    getProfile: () => request('/auth/profile'),
    updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: data }),

    // Dashboard
    getDashboard: () => request('/dashboard/'),
    getStats: () => request('/dashboard/stats'),
    getInsights: () => request('/dashboard/insights'),

    // Roadmap
    getRoadmap: () => request('/roadmap/'),
    getRoadmapProgress: () => request('/roadmap/progress'),
    toggleRoadmapDay: (itemId) => request(`/roadmap/toggle/${itemId}`, { method: 'POST' }),

    // Tasks
    getTasks: () => request('/tasks/'),
    createTask: (data) => request('/tasks/', { method: 'POST', body: data }),
    updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: data }),
    deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
    getStreak: () => request('/tasks/streak'),

    // Chat
    chat: (message) => request('/chat/', { method: 'POST', body: { message } }),
    clearChat: () => request('/chat/clear', { method: 'POST' }),

    // Settings
    getSettings: () => request('/settings/'),
    updateSettings: (data) => request('/settings/', { method: 'PUT', body: data }),
    changePassword: (current, next) => request('/settings/password', { method: 'PUT', body: { current_password: current, new_password: next } }),
    deleteAccount: () => request('/settings/delete-account', { method: 'DELETE' }),

    // Community
    getCommunityPosts: (field) => request(`/community/posts${field ? `?field=${encodeURIComponent(field)}` : ''}`),
    createCommunityPost: (data) => request('/community/posts', { method: 'POST', body: data }),
    togglePostLike: (postId) => request(`/community/posts/${postId}/like`, { method: 'POST' }),
    getPostComments: (postId) => request(`/community/posts/${postId}/comments`),
    addPostComment: (postId, comment) => request(`/community/posts/${postId}/comments`, { method: 'POST', body: { comment } }),
    toggleFollow: (userId) => request(`/community/follow/${userId}`, { method: 'POST' }),
};
