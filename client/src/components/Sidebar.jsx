// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setRole(user?.role || '');
  }, []);

  return (
    <div className="w-64 bg-blue-700 text-white p-6 space-y-4 min-h-screen">
      <h2 className="text-xl font-bold mb-4">
        {role === 'freelancer' ? 'Freelancer Panel' : 'Client Panel'}
      </h2>

      <Link to="/dashboard" className="block hover:text-blue-200">Dashboard</Link>
      <Link to="/profile" className="block hover:text-blue-200">Profile</Link>

      {role === 'freelancer' && (
        <>
          <Link to="/freelancer/services" className="block hover:text-blue-200">My Services</Link>
          <Link to="/freelancer/create-service" className="block hover:text-blue-200">Create Service</Link>
        </>
      )}

      {role === 'client' && (
        <>
          <Link to="/post-job" className="block hover:text-blue-200">Post Job</Link>
          <Link to="/client/jobs" className="block hover:text-blue-200">My Jobs</Link>
        </>
      )}
    </div>
  );
}
