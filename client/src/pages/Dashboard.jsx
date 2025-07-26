// 📁 src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBriefcase,
  FaFileContract,
  FaDollarSign,
  FaStar,
  FaPlusCircle,
  FaUsers,
  FaLayerGroup,
} from 'react-icons/fa';

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

  const cards = isFreelancer
    ? [
        {
          icon: <FaBriefcase />,
          title: 'My Services',
          description: 'Manage your active service listings',
          to: '/freelancer/services',
          bg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        },
        {
          icon: <FaPlusCircle />,
          title: 'Create Service',
          description: 'Add a new service to offer',
          to: '/freelancer/create-service',
          bg: 'bg-cyan-100',
          iconColor: 'text-cyan-600',
        },
        {
          icon: <FaFileContract />,
          title: 'Contracts',
          description: 'View and manage your contracts',
          to: '/freelancer/contracts',
          bg: 'bg-green-100',
          iconColor: 'text-green-600',
        },
        {
          icon: <FaDollarSign />,
          title: 'Earnings',
          description: 'Track your earnings and milestones',
          to: '/freelancer/earnings',
          bg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        },
        {
          icon: <FaStar />,
          title: 'Reviews',
          description: 'See feedback from clients',
          to: '/freelancer/reviews',
          bg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
        },
      ]
    : [
        {
          icon: <FaPlusCircle />,
          title: 'Post a Job',
          description: 'Create a new job listing',
          to: '/post-job',
          bg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        },
        {
          icon: <FaBriefcase />,
          title: 'My Jobs',
          description: 'Manage your job listings',
          to: '/client/jobs',
          bg: 'bg-green-100',
          iconColor: 'text-green-600',
        },
        {
          icon: <FaFileContract />,
          title: 'Contracts',
          description: 'Track project progress',
          to: '/client/contracts',
          bg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        },
        {
          icon: <FaUsers />,
          title: 'Freelancers',
          description: 'Browse and manage hired freelancers',
          to: '/freelancers',
          bg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
        },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your freelance activities with ease.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <DashboardCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, description, to, bg, iconColor }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-6 ${bg} hover:shadow-xl transition-all shadow-md`}
    >
      <div className={`${iconColor} text-4xl mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-700 text-sm">{description}</p>
    </Link>
  );
}
