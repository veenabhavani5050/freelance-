import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlusCircle,
  FaBriefcase,
  FaFileContract,
  FaUsers,
  FaListAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';

const ClientDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const cards = [
    {
      icon: <FaPlusCircle />,
      title: 'Post a Job',
      to: '/post-job', // <-- UPDATED LINK to match your App.jsx
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: <FaBriefcase />,
      title: 'My Job Listings',
      to: '/client/jobs',
      bg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: <FaFileContract />,
      title: 'Active Contracts',
      to: '/contracts', // Updated to match your App.jsx
      bg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: <FaUsers />,
      title: 'Find Freelancers',
      to: '/freelancers',
      bg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: <FaListAlt />,
      title: 'Browse All Services',
      to: '/services',
      bg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Payment History',
      to: '/client/payments', // You may need to add this route to App.jsx
      bg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Welcome, {user?.name || 'Client'}
        </h1>
        <p className="text-gray-600 text-lg">Your hiring dashboard is ready!</p>
      </div>
      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <DashboardCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
};

function DashboardCard({ icon, title, to, bg, iconColor }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-6 ${bg} flex flex-col items-start hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-md`}
    >
      <div className={`${iconColor} text-4xl mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-1 text-gray-800">{title}</h3>
      <p className="text-gray-500 text-sm">{getCardDescription(title)}</p>
    </Link>
  );
}

function getCardDescription(title) {
  switch (title) {
    case 'Post a Job':
      return 'Create a new job listing to attract freelancers.';
    case 'My Job Listings':
      return 'View, edit, or close your posted jobs.';
    case 'Active Contracts':
      return 'Manage ongoing projects and contracts.';
    case 'Find Freelancers':
      return 'Search and connect with skilled freelancers.';
    case 'Browse All Services':
      return 'Explore services offered by freelancers.';
    case 'Payment History':
      return 'Review your transaction and payment records.';
    default:
      return '';
  }
}

export default ClientDashboard;