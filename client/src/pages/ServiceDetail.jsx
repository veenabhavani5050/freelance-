// src/pages/ServiceDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaTags,
  FaRegClock,
  FaRupeeSign,
  FaClipboardList,
  FaUser
} from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    axios.get(`/api/services/${id}`)
      .then(res => setService(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!service) return (
    <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
      Loading...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4">{service.title}</h1>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="flex items-center text-gray-600 mb-2 sm:mb-0">
            <FaUser className="mr-2 text-blue-500" />
            <span className="font-medium">{service?.freelancer?.name || "Freelancer"}</span>
          </div>

          <div className="flex space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <FaTags className="mr-1 text-yellow-600" />
              <strong className="mr-1">Category:</strong> {service.category}
            </span>
            <span className="flex items-center">
              <FaRupeeSign className="mr-1 text-green-600" />
              <strong className="mr-1">Price:</strong> ₹{service.price}
            </span>
            <span className="flex items-center">
              <FaRegClock className="mr-1 text-indigo-600" />
              <strong className="mr-1">Delivery:</strong> {service.deliveryTime} days
            </span>
          </div>
        </div>

        <div className="text-gray-700 text-lg mb-4 leading-relaxed">
          <FaClipboardList className="inline-block text-gray-500 mr-2" />
          {service.description}
        </div>

        {service.tags?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-gray-800 font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
