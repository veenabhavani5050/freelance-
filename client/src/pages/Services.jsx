// src/pages/Services.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const isFreelancer = user?.role === 'freelancer';

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedId) => {
    setServices(prev => prev.filter(service => service._id !== deletedId));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Available Services</h2>
        {isFreelancer && (
          <Link
            to="/services/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Post a Service
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-500">No services available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map(service => (
            <ServiceCard key={service._id} service={service} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
