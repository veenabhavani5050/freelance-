// src/components/Topbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Topbar() {
  const { user, logout } = useUser();

  // Do not render the topbar if the user is not logged in.
  if (!user) {
    return null;
  }

  // Get the first letter of the user's email for the avatar.
  const firstLetter = user?.user?.email?.charAt(0).toUpperCase() || '?';

  // Determine the dashboard title based on the user's role.
  const dashboardTitle =
    user?.user?.role === 'freelancer' ? 'Freelancer Dashboard' : 'Client Dashboard';

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold text-blue-700">
        {dashboardTitle}
      </h1>

      <div className="flex items-center gap-4">
        <Link to="/profile" title="View Profile" className="flex items-center gap-2">
          {/* Avatar using the first letter of the email */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold border hover:ring-2 hover:ring-blue-500 transition-all duration-200">
            {firstLetter}
          </div>
        </Link>

        {/* Display the user's name */}
        <span className="text-gray-700 font-semibold capitalize">
          {user?.user?.name || 'User'}
        </span>

        {/* Logout button */}
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