import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaBriefcase, FaFileContract, FaUsers, FaListAlt, FaMoneyBillWave, FaEdit, FaCheckSquare } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

const ClientDashboard = () => {
  const { user } = useUser();

  const cards = [
    {
      icon: <FaPlusCircle />,
      title: 'Post a Job',
      to: '/post-job',
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      description: 'Create a new job listing to attract freelancers.',
    },
    {
      icon: <FaBriefcase />,
      title: 'My Job Listings',
      to: '/client/jobs',
      bg: 'bg-green-100',
      iconColor: 'text-green-600',
      description: 'View, edit, and manage your posted jobs.',
    },
    {
      icon: <FaCheckSquare />,
      title: 'Manage Proposals',
      to: '/client/proposals', // New card for proposal management
      bg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      description: 'Review and accept proposals for your jobs.',
    },
    {
      icon: <FaFileContract />,
      title: 'Active Contracts',
      to: '/contracts',
      bg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      description: 'Manage ongoing projects and contracts.',
    },
    {
      icon: <FaUsers />,
      title: 'Find Freelancers',
      to: '/freelancers',
      bg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      description: 'Search and connect with skilled freelancers.',
    },
    {
      icon: <FaListAlt />,
      title: 'Browse All Services',
      to: '/services',
      bg: 'bg-red-100',
      iconColor: 'text-red-600',
      description: 'Explore services offered by freelancers.',
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Payment History',
      to: '/client/payments',
      bg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      description: 'Review your transaction and payment records.',
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

function DashboardCard({ icon, title, to, bg, iconColor, description }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-6 ${bg} flex flex-col items-start hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-md`}
    >
      <div className={`${iconColor} text-4xl mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-1 text-gray-800">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </Link>
  );
}

export default ClientDashboard;