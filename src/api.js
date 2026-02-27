/**
 * ORBIT — API Utility
 * Centralized fetch wrapper for all backend calls.
 * Vite proxy forwards /api/* to Flask on port 5000.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
        throw { status: res.status, ...data };
    }

    return data;
}

// Auth
export const api = {
    signup: (email, password) =>
        request('/auth/signup', { method: 'POST', body: { email, password } }),

    login: (email, password) =>
        request('/auth/login', { method: 'POST', body: { email, password } }),

    logout: () =>
        request('/auth/logout', { method: 'POST' }),

    getProfile: () =>
        request('/auth/profile'),

    updateProfile: (data) =>
        request('/auth/profile', { method: 'PUT', body: data }),

    // Dashboard
    getDashboard: () => request('/dashboard/'),
    getStats: () => request('/dashboard/stats'),
    getInsights: () => request('/dashboard/insights'),

    // Roadmap
    getRoadmap: () => request('/roadmap/'),
    generateRoadmap: () => request('/roadmap/generate', { method: 'POST' }),
    getProgress: () => request('/roadmap/progress'),

    // Tasks
    getTasks: () => request('/tasks/'),
    createTask: (data) => request('/tasks/', { method: 'POST', body: data }),
    updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: data }),
    deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
    getStreak: () => request('/tasks/streak'),
};
