// src/pages/FreelancerServices.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const FreelancerServices = () => {
  const [services, setServices] = useState([]);

  const fetchMyServices = async () => {
    try {
      const res = await axios.get('/api/services', { withCredentials: true });
      const userId = JSON.parse(localStorage.getItem('user'))._id;
      setServices(res.data.filter(service => service.user._id === userId));
    } catch {
      toast.error('Failed to load your services');
    }
  };

  useEffect(() => { fetchMyServices(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      toast.success('Service deleted');
      fetchMyServices();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">My Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service._id} className="border rounded p-4 shadow space-y-2">
            <h3 className="font-semibold text-lg">{service.title}</h3>
            <p>₹{service.price}</p>
            <p className="text-sm text-gray-500">{service.category}</p>
            <div className="space-x-2">
              <Link to={`/freelancer/services/${service._id}/edit`} className="text-blue-500 hover:underline">Edit</Link>
              <button onClick={() => handleDelete(service._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerServices;
