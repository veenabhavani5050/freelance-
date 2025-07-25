// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, DollarSign, Star, PlusCircle, Users } from 'lucide-react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">User not found. Please log in again.</p>
      </div>
    );
  }

  const isFreelancer = user.role === 'freelancer';
  const isClient = user.role === 'client';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here’s a quick overview of your account.</p>

        {isFreelancer && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card icon={<Briefcase className="text-blue-600" />} title="My Services" description="Manage your active service listings" to="/my-services" />
            <Card icon={<FileText className="text-blue-600" />} title="Contracts" description="View and manage your contracts" to="/freelancer/contracts" />
            <Card icon={<DollarSign className="text-blue-600" />} title="Earnings" description="Track your earnings and milestones" to="/freelancer/earnings" />
            <Card icon={<Star className="text-blue-600" />} title="Reviews" description="See feedback from clients" to="/freelancer/reviews" />
          </div>
        )}

        {isClient && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card icon={<PlusCircle className="text-blue-600" />} title="Post a Job" description="Create a new job listing" to="/post-job" />
            <Card icon={<Briefcase className="text-blue-600" />} title="My Jobs" description="Manage your job listings" to="/client/jobs" />
            <Card icon={<FileText className="text-blue-600" />} title="Contracts" description="Track project progress" to="/client/contracts" />
            <Card icon={<Users className="text-blue-600" />} title="Freelancers" description="Browse and manage hired freelancers" to="/freelancers" />
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="flex items-start gap-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-5 transition shadow-sm hover:shadow-md"
    >
      <div className="mt-1">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-blue-800">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}