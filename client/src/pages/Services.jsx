import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('/api/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Available Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map(service => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
