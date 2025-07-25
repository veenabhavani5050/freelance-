import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  return (
    <div className="w-64 bg-blue-700 text-white p-6 space-y-4 min-h-screen">
      <h2 className="text-xl font-bold">{role === 'client' ? 'Client' : 'Freelancer'} Panel</h2>
      <Link to="/dashboard" className="block hover:text-blue-200">Dashboard</Link>
      {/* Add more links based on role in future */}
    </div>
  );
}