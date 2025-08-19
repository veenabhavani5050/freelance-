import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();

  // If there's no user or the user object is not fully loaded, don't render the sidebar.
  if (!user || !user.user) {
    return null;
  }

  // Correctly access the user's role from the nested user object
  const role = user.user.role;

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
          <Link to="/jobs" className={linkClass('/jobs')}>
            🔍 Browse Jobs
          </Link>
          <Link to="/freelancer/proposals" className={linkClass('/freelancer/proposals')}>
            📝 My Proposals
          </Link>
          <Link to="/contracts" className={linkClass('/contracts')}>
            📁 My Contracts
          </Link>
          <Link to="/freelancer/services" className={linkClass('/freelancer/services')}>
            📦 My Services
          </Link>
          <Link to="/freelancer/reviews" className={linkClass('/freelancer/reviews')}>
            ⭐ Reviews
          </Link>
          <Link to="/freelancer/earnings" className={linkClass('/freelancer/earnings')}>
            💰 My Earnings
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
          <Link to="/client/proposals" className={linkClass('/client/proposals')}>
            📑 Proposals
          </Link>
          <Link to="/contracts" className={linkClass('/contracts')}>
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