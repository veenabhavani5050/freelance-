import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import API from '../api/axios';
import { toast } from 'react-toastify';

const ServiceCard = ({ service, onDelete }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isFreelancer = user?.role === 'freelancer';
  const isOwner = user?.user?._id === service?.user?._id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await API.delete(`/services/${service._id}`);
        onDelete(service._id);
        toast.success('Service deleted successfully!');
      } catch (error) {
        toast.error('Error deleting service');
        console.error('Failed to delete service:', error);
      }
    }
  };

  return (
    <div className="bg-white border border-blue-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between hover:scale-[1.02]">
      {/* Service Details */}
      <Link to={`/services/${service._id}`} className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
          {service.title}
        </h3>
        <p className="text-sm text-gray-500">{service.category}</p>
        <p className="text-blue-600 font-bold text-lg mt-3">₹{service.price}</p>
      </Link>

      {/* Actions */}
      {isFreelancer && isOwner && (
        <div className="flex items-center gap-3 mt-4">
          <Link
            to={`/freelancer/services/${service._id}/edit`}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            title="Edit Service"
          >
            <FaEdit />
            <span className="text-sm font-medium">Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            title="Delete Service"
          >
            <FaTrash />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;