// src/pages/Dashboard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import FreelancerDashboard from './FreelancerDashboard';
import ClientDashboard from './ClientDashboard';

export default function Dashboard() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading dashboard...</div>; // You can use a dedicated loader component here
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const role = user.user.role;

  if (role === 'freelancer') {
    return <FreelancerDashboard />;
  } else if (role === 'client') {
    return <ClientDashboard />;
  } else {
    // Fallback for an undefined role
    return <div className="text-center p-8">Invalid user role.</div>;
  }
}