import React from 'react';

export default function Topbar() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold text-blue-700">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user?.name}</span>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  );
}