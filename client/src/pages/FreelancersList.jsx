// src/pages/FreelancersList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FreelancersList = () => {
  const [freelancers, setFreelancers] = useState([]);

  const fetchFreelancers = async () => {
    try {
      const res = await axios.get('/api/users', { withCredentials: true });
      const data = res.data.filter(user => user.role === 'freelancer');
      setFreelancers(data);
    } catch (err) {
      toast.error('Failed to load freelancers');
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">All Freelancers</h2>
      {freelancers.length === 0 ? (
        <p className="text-gray-500">No freelancers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {freelancers.map(freelancer => (
            <div key={freelancer._id} className="border rounded-lg p-4 shadow space-y-2">
              <h3 className="text-lg font-semibold text-blue-700">{freelancer.name}</h3>
              <p><span className="font-medium">Email:</span> {freelancer.email}</p>
              <p><span className="font-medium">Skills:</span> {freelancer.skills?.join(', ') || 'N/A'}</p>
              <p><span className="font-medium">Location:</span> {freelancer.location || 'Not provided'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancersList;
