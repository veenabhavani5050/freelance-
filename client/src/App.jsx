import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Public Service Pages
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';

// Shared Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FreelancersList from './pages/FreelancersList';

// Freelancer Pages
import CreateService from './pages/CreateService';
import FreelancerServices from './pages/FreelancerServices';
import EditService from './pages/EditService';
import FreelancerDashboard from './pages/FreelancerDashboard';

// Client Pages
import PostJob from './pages/PostJob';
import ClientJobs from './pages/ClientJobs';
import ClientJobDetails from './pages/ClientJobDetails';
import EditJob from './pages/EditJob';
import ClientDashboard from './pages/ClientDashboard';

// Contract Pages
import Contracts from './pages/Contracts';
import CreateContract from './pages/CreateContract';
import EditContract from './pages/EditContract';
import ContractDetails from './pages/ContractDetails';

// Layout & Auth
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Layout Pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
        </Route>

        {/* 🔓 Public Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🔒 Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* 🎯 Common Protected */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/freelancers" element={<FreelancersList />} />

            {/* 👨‍💻 Freelancer */}
            <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
            <Route path="/freelancer/create-service" element={<CreateService />} />
            <Route path="/freelancer/services" element={<FreelancerServices />} />
            <Route path="/freelancer/services/:id/edit" element={<EditService />} />

            {/* 🧑‍💼 Client */}
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/client/jobs" element={<ClientJobs />} />
            <Route path="/client/jobs/:id" element={<ClientJobDetails />} />
            <Route path="/client/jobs/:id/edit" element={<EditJob />} />

            {/* 📄 Contract Pages */}
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/contracts/create" element={<CreateContract />} />
            <Route path="/contracts/:id" element={<ContractDetails />} />
            <Route path="/contracts/:id/edit" element={<EditContract />} />
          </Route>
        </Route>

        {/* 🚫 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
