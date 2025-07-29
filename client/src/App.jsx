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
import EditService from './pages/EditService';
import PostJob from './pages/PostJob';
import ClientJobs from './pages/ClientJobs';
import ClientJobDetails from './pages/ClientJobDetails';
import EditJob from './pages/EditJob';

// Service (Public) Pages
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/freelancer/create-service" element={<CreateService />} />
            <Route path="/freelancer/services" element={<FreelancerServices />} />
            <Route path="/freelancer/services/:id/edit" element={<EditService />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/client/jobs" element={<ClientJobs />} />
            <Route path="/client/jobs/:id" element={<ClientJobDetails />} />
            <Route path="/client/jobs/:id/edit" element={<EditJob />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
