// src/components/Topbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import useUser

export default function Topbar() {
  const { user, logout } = useUser(); // Get user and logout function from context

  if (!user) {
    return null; // Don't render topbar if not logged in
  }

  const profileImage = user?.user?.profilePic?.trim()
    ? user.user.profilePic
    : '/default-avatar.png';

  const dashboardTitle =
    user?.user?.role === 'freelancer' ? 'Freelancer Dashboard' : 'Client Dashboard';

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold text-blue-700">
        {dashboardTitle}
      </h1>

      <div className="flex items-center gap-4">
        <Link to="/profile" title="View Profile" className="flex items-center gap-2">
          <img
            src={profileImage}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border hover:ring-2 hover:ring-blue-500 transition-all duration-200"
          />
        </Link>

        <span className="text-gray-700 font-semibold capitalize">
          {user?.user?.name || 'User'}
        </span>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}