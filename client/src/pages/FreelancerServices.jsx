// ✅ src/pages/FreelancerServices.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

export default function FreelancerServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get('/api/services/my-services');
        setServices(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service._id} className="bg-white rounded-xl shadow p-4 border">
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p>{service.description}</p>
            <p className="text-blue-600">₹{service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}