import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import StreamSelection from './pages/StreamSelection';
import Roadmap from './pages/Roadmap';
import Tasks from './pages/Tasks';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Community from './pages/Community';
import SkillProgress from './pages/SkillProgress';
import ChatWidget from './components/ChatWidget';

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/stream-selection" element={<StreamSelection />} />
                <Route path="/stream-dashboard" element={<Roadmap />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/community" element={<Community />} />
                <Route path="/skill-progress" element={<SkillProgress />} />
            </Routes>
            <ChatWidget />
        </Router>
    );
}
