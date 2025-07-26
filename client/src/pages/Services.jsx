// ✅ src/pages/Services.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
          <Link
            to={`/services/${service._id}`}
            key={service._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p className="text-gray-600">{service.category}</p>
            <p className="text-blue-500 font-bold">₹{service.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;