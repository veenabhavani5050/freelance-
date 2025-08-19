import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ContractCard from '../components/ContractCard';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { FaPlus, FaFileContract } from 'react-icons/fa';

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const { data } = await API.get('/contracts');
        
        if (Array.isArray(data)) {
          setContracts(data);
        } else {
          setContracts([]);
        }
      } catch (err) {
        toast.error('Could not load contracts');
        setContracts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchContracts();
  }, []);

  if (loading) return <Loader message="Loading contracts..." />;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FaFileContract className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Your Contracts</h2>
        </div>
        <Link
          to="/contracts/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FaPlus /> New Contract
        </Link>
      </div>

      {contracts.length === 0 ? (
        <p className="text-gray-600">No contracts yet. Click above to create one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map(contract => (
            <div key={contract._id} className="border rounded-lg shadow p-4 bg-white">
              <ContractCard contract={contract} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}