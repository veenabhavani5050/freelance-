// src/components/ServiceCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import API from '../api/axios';

const ServiceCard = ({ service, onDelete }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isFreelancer = user?.role === 'freelancer';
  const isOwner = user?._id === service?.user;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await API.delete(`/services/${service._id}`);
        onDelete(service._id);
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Error deleting service');
      }
    }
  };

  return (
    <div className="relative border border-gray-300 rounded-xl p-4 shadow hover:shadow-lg transition-all bg-white">
      <Link to={`/services/${service._id}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
        <p className="text-gray-500 text-sm">{service.category}</p>
        <p className="text-green-600 font-bold mt-2">₹{service.price}</p>
      </Link>

      {isFreelancer && isOwner && (
        <div className="absolute top-2 right-2 flex flex-col items-end space-y-2">
          <Link
            to={`/services/${service._id}/edit`}
            className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 text-sm"
            title="Edit Service"
          >
            <FaEdit />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
            title="Delete Service"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
