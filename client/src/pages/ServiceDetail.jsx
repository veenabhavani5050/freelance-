// ✅ src/pages/ServiceDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    axios.get(`/api/services/${id}`)
      .then(res => setService(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!service) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-2">{service.title}</h2>
      <p className="text-gray-800 mb-2">{service.description}</p>
      <p className="text-sm text-gray-500 mb-2">Category: {service.category}</p>
      <p className="text-blue-500 text-xl font-bold">₹{service.price}</p>
      <p className="text-sm mt-2 text-gray-400">Delivery Time: {service.deliveryTime} days</p>
    </div>
  );
};

export default ServiceDetail;