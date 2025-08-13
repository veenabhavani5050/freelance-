import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBriefcase,
  FaPlusCircle,
  FaFileContract,
  FaDollarSign,
  FaStar,
  FaListAlt,
  FaUser
} from 'react-icons/fa';

const FreelancerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const cards = [
    {
      icon: <FaBriefcase />,
      title: 'My Services',
      to: '/freelancer/services',
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: <FaPlusCircle />,
      title: 'Create a Service',
      to: '/freelancer/create-service',
      bg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
    {
      icon: <FaFileContract />,
      title: 'Contracts',
      to: '/freelancer/contracts',
      bg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: <FaDollarSign />,
      title: 'My Earnings',
      to: '/freelancer/earnings',
      bg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: <FaStar />,
      title: 'My Reviews',
      to: '/freelancer/reviews',
      bg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: <FaListAlt />,
      title: 'Browse Job Listings',
      to: '/jobs',
      bg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: <FaUser />,
      title: 'My Profile',
      to: `/freelancer/profile/${user?._id}`,
      bg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Welcome, {user?.name || 'Freelancer'}
        </h1>
        <p className="text-gray-600 text-lg">Manage your freelance work efficiently.</p>
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
    case 'My Services':
      return 'View and manage all your service listings.';
    case 'Create a Service':
      return 'Add a new service for clients to discover.';
    case 'Contracts':
      return 'Track and manage your project contracts.';
    case 'My Earnings':
      return 'Monitor your payments and transaction history.';
    case 'My Reviews':
      return 'See what clients are saying about your work.';
    case 'Browse Job Listings':
      return 'Find and apply for new job opportunities.';
    case 'My Profile':
      return 'Update your personal info and portfolio.';
    default:
      return '';
  }
}

export default FreelancerDashboard;