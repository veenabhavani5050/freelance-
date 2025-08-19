import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // Use the configured API instance
import { toast } from 'react-toastify';

const FreelancerServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyServices = async () => {
    try {
      const { data } = await API.get('/services/my-services');
      setServices(data);
    } catch (err) {
      toast.error('Failed to load your services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchMyServices(); // Re-fetch services to update the list
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return <p className="p-4 text-center">Loading services...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">My Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <p>You have not posted any services yet. <Link to="/freelancer/create-service" className="text-blue-500">Create one now!</Link></p>
        ) : (
          services.map(service => (
            <div key={service._id} className="border rounded-lg p-4 shadow space-y-2 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p>₹{service.price}</p>
                <p className="text-sm text-gray-500">{service.category}</p>
              </div>
              <div className="space-x-2 mt-4">
                <Link to={`/freelancer/services/${service._id}/edit`} className="text-blue-500 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(service._id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FreelancerServices;