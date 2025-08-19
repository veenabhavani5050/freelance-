import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

// Public Job Pages (accessible to freelancers without login)
import JobsList from './pages/JobsList';
import JobDetails from './pages/JobDetails';

// Shared Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FreelancersList from './pages/FreelancersList';

// Freelancer Pages
import CreateService from './pages/CreateService';
import FreelancerServices from './pages/FreelancerServices';
import EditService from './pages/EditService';
import FreelancerEarnings from './pages/FreelancerEarnings';
import FreelancerReviews from './pages/FreelancerReviews';
import FreelancerProposals from './pages/FreelancerProposals';
import CreateProposal from './pages/CreateProposal';

// Client Pages
import PostJob from './pages/PostJob';
import ClientJobs from './pages/ClientJobs';
import ClientJobDetails from './pages/ClientJobDetails';
import EditJob from './pages/EditJob';
import ClientPayments from './pages/ClientPayments';

// Contract Pages
import Contracts from './pages/Contracts';
import CreateContract from './pages/CreateContract';
import EditContract from './pages/EditContract';
import ContractDetails from './pages/ContractDetails';

// New Pages
import PaymentPage from './pages/PaymentPage';
import NotificationsPage from './pages/NotificationsPage';

// Layout & Auth
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Routes>
            {/* 🌐 Public Routes - These pages are accessible to anyone */}
            {/* The <Layout> component provides the common UI (like navbars and footers) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/jobs" element={<JobsList />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
            </Route>

            {/* 🔓 Public Auth Pages - These pages are typically full-screen and don't need the main layout */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* 🔒 Protected Routes - These pages are only accessible to authenticated users */}
            {/* The <ProtectedRoute> component checks for authentication before rendering child routes */}
            <Route element={<ProtectedRoute />}>
                {/* We nest another <Layout> here to apply the common UI to all protected pages */}
                <Route element={<Layout />}>
                    {/* 🎯 Common Protected Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/freelancers" element={<FreelancersList />} />
                    <Route path="/notifications" element={<NotificationsPage />} />

                    {/* 👨‍💻 Freelancer Routes */}
                    <Route path="/freelancer/create-service" element={<CreateService />} />
                    <Route path="/freelancer/services" element={<FreelancerServices />} />
                    <Route path="/freelancer/services/:id/edit" element={<EditService />} />
                    <Route path="/freelancer/earnings" element={<FreelancerEarnings />} />
                    <Route path="/freelancer/reviews" element={<FreelancerReviews />} />
                    <Route path="/freelancer/proposals" element={<FreelancerProposals />} />
                    {/* This is the new route for creating a proposal, correctly placed inside the protected block */}
                    <Route path="/proposals/submit/:id" element={<CreateProposal />} />

                    {/* 🧑‍💼 Client Routes */}
                    <Route path="/post-job" element={<PostJob />} />
                    <Route path="/client/jobs" element={<ClientJobs />} />
                    <Route path="/client/jobs/:id" element={<ClientJobDetails />} />
                    <Route path="/client/jobs/:id/edit" element={<EditJob />} />
                    <Route path="/client/payments" element={<ClientPayments />} />
                    <Route path="/client/jobs/:jobId/pay" element={<PaymentPage />} />

                    {/* 📄 Contract Routes */}
                    <Route path="/contracts" element={<Contracts />} />
                    <Route path="/contracts/create" element={<CreateContract />} />
                    <Route path="/contracts/:id" element={<ContractDetails />} />
                    <Route path="/contracts/:id/edit" element={<EditContract />} />
                </Route>
            </Route>

            {/* 🚫 Catch All - A fallback route for any unknown URLs */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;