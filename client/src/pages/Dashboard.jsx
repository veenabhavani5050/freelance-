// src/pages/Dashboard.jsx
import React from 'react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
    </div>
  );
}