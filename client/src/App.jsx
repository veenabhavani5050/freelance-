import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateService from './pages/CreateService';
import FreelancerServices from './pages/FreelancerServices';
import PostJob from './pages/PostJob';
import ClientJobs from './pages/ClientJobs';
import ClientJobDetails from './pages/ClientJobDetails';
import EditJob from './pages/EditJob';

// Service Pages
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Service Routes (Public but with Layout) */}
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/services/:id" element={<Layout><ServiceDetail /></Layout>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/freelancer/create-service" element={<Layout><CreateService /></Layout>} />
          <Route path="/freelancer/services" element={<Layout><FreelancerServices /></Layout>} />
          <Route path="/post-job" element={<Layout><PostJob /></Layout>} />
          <Route path="/client/jobs" element={<Layout><ClientJobs /></Layout>} />
          <Route path="/client/jobs/:id" element={<Layout><ClientJobDetails /></Layout>} />
          <Route path="/client/jobs/:id/edit" element={<Layout><EditJob /></Layout>} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
