import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await axios.get('/api/users?role=freelancer');
        setFreelancers(res.data);
      } catch (err) {
        console.error('Failed to fetch freelancers:', err);
      }
    };
    fetchFreelancers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">All Freelancers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {freelancers.map((user) => (
          <div key={user._id} className="p-4 border rounded shadow">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Freelancers;
