// src/components/Topbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Topbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const profileImage = user?.profilePic?.trim()
    ? user.profilePic
    : '/default-avatar.png';

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold text-blue-700">
        {user?.role === 'freelancer' ? 'Freelancer Dashboard' : 'Client Dashboard'}
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
          {user?.name || 'User'}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
