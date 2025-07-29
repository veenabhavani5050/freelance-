import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <Link
      to={`/services/${service._id}`}
      className="border rounded-xl p-4 shadow hover:shadow-lg"
    >
      <h3 className="text-lg font-semibold">{service.title}</h3>
      <p className="text-gray-600">{service.category}</p>
      <p className="text-blue-500 font-bold">₹{service.price}</p>
    </Link>
  );
};

export default ServiceCard;
