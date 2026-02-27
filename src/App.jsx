import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StreamSelection from './pages/StreamSelection';
import StreamDashboard from './pages/StreamDashboard';
import Insights from './pages/Insights';

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/stream-selection" element={<StreamSelection />} />
                <Route path="/stream-dashboard" element={<StreamDashboard />} />
                <Route path="/insights" element={<Insights />} />
            </Routes>
        </Router>
    );
}
