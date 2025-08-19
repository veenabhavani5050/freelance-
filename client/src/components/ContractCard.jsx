import React from 'react';
import { Link } from 'react-router-dom';

export default function ContractCard({ contract }) {
  const { _id, title, totalAmount, status, freelancer, client } = contract;
  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>
        <strong>Status:</strong> <span className="capitalize">{status.replace('_', ' ')}</span>
      </p>
      <p>
        <strong>Total:</strong> ₹{totalAmount}
      </p>
      <p>
        <strong>Freelancer:</strong> {freelancer?.name || 'N/A'}
      </p>
      <p>
        <strong>Client:</strong> {client?.name || 'N/A'}
      </p>
      <Link to={`/contracts/${_id}`} className="mt-2 inline-block text-blue-600 hover:underline">
        View Details →
      </Link>
    </div>
  );
}