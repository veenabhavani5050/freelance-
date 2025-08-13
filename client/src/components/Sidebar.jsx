// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();

  // Don't render the sidebar if the user is not logged in
  if (!user) {
    return null;
  }

  const role = user?.user?.role;

  // A helper function to apply active class to the current link
  const linkClass = (path) =>
    `block py-2 px-3 rounded hover:bg-blue-600 transition ${
      location.pathname.startsWith(path) ? 'bg-blue-800 font-semibold' : ''
    }`;

  return (
    <div className="w-64 bg-blue-700 text-white p-6 space-y-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4">
        {role === 'freelancer' ? '🧑‍🎨 FreelanceHub: Freelancer' : '🧑‍💼 FreelanceHub: Client'}
      </h2>

      {/* Freelancer Navigation */}
      {role === 'freelancer' ? (
        <>
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            🏠 Dashboard
          </Link>
          <Link to="/profile" className={linkClass('/profile')}>
            👤 Profile
          </Link>
          <Link to="/freelancer/services" className={linkClass('/freelancer/services')}>
            📦 My Services
          </Link>
          <Link to="/freelancer/create-service" className={linkClass('/freelancer/create-service')}>
            ➕ Create Service
          </Link>
          <Link to="/freelancer/contracts" className={linkClass('/freelancer/contracts')}>
            📁 My Contracts
          </Link>
          <Link to="/freelancer/earnings" className={linkClass('/freelancer/earnings')}>
            💰 Earnings
          </Link>
          <Link to="/freelancer/reviews" className={linkClass('/freelancer/reviews')}>
            ⭐ My Reviews
          </Link>
        </>
      ) : (
        /* Client Navigation */
        <>
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            🏠 Dashboard
          </Link>
          <Link to="/profile" className={linkClass('/profile')}>
            👤 Profile
          </Link>
          <Link to="/post-job" className={linkClass('/post-job')}>
            📝 Post a Job
          </Link>
          <Link to="/client/jobs" className={linkClass('/client/jobs')}>
            📋 My Jobs
          </Link>
          <Link to="/client/contracts" className={linkClass('/client/contracts')}>
            📁 Contracts
          </Link>
          <Link to="/freelancers" className={linkClass('/freelancers')}>
            🔍 Find Freelancers
          </Link>
          <Link to="/client/payments" className={linkClass('/client/payments')}>
            💸 Payments
          </Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;