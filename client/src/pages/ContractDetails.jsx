import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; // Ensure this instance sends the JWT token
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';

export default function ContractDetails() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser(); // Get user from context, not localStorage

  useEffect(() => {
    async function fetchDetail() {
      try {
        const { data } = await API.get(`/contracts/${id}`);
        setContract(data);
      } catch (error) {
        // Handle a 403 Forbidden error specifically
        if (error.response?.status === 403) {
          toast.error('You are not authorized to view this contract.');
          navigate('/contracts');
        } else {
          // Handle all other errors generically
          toast.error(error.response?.data?.message || 'Failed to load contract details');
        }
      }
    }
    
    // Only attempt to fetch if a user is authenticated
    if (user && id) {
      fetchDetail();
    } else if (!user) {
      // Redirect or show a message if not authenticated
      toast.error('Please log in to view contracts.');
      navigate('/login');
    }
  }, [id, navigate, user]);

  const updateStatus = async (newStatus) => {
    try {
      await API.patch(`/contracts/${id}/status`, { status: newStatus });
      toast.success('Contract status updated');
      navigate('/contracts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const completeMilestone = async (idx) => {
    try {
      await API.patch(`/contracts/${id}/milestones/${idx}/complete`);
      toast.success('Milestone marked completed');
      setContract((c) => {
        const updatedMilestones = [...c.milestones];
        updatedMilestones[idx].isCompleted = true;
        return { ...c, milestones: updatedMilestones };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Milestone update failed');
    }
  };

  // Check for the user's role and ID from the context, not localStorage
  const isFreelancer = user?.role === 'freelancer' && user?._id === contract?.freelancer?._id;
  const isClient = user?.role === 'client' && user?._id === contract?.client?._id;
  const canEdit = isClient && (contract?.status === 'pending' || contract?.status === 'in_progress');

  if (!contract) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">{contract.title}</h2>
      <p>
        <strong>Description:</strong> {contract.description}
      </p>
      <p>
        <strong>Deadline:</strong> {contract.deadline?.split('T')[0]}
      </p>
      <p>
        <strong>Total Amount:</strong> ₹{contract.totalAmount}
      </p>
      <p>
        <strong>Status:</strong> <span className="capitalize">{contract.status.replace('_', ' ')}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg bg-gray-100">
          <h4 className="font-semibold text-lg">Client</h4>
          <p>{contract.client?.name || 'N/A'}</p>
        </div>
        <div className="border p-4 rounded-lg bg-gray-100">
          <h4 className="font-semibold text-lg">Freelancer</h4>
          <p>{contract.freelancer?.name || 'N/A'}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-6">Milestones</h3>
      {contract.milestones.map((m, idx) => (
        <div key={idx} className="border p-4 rounded-lg shadow-sm">
          <h4 className="font-semibold">{m.title}</h4>
          <p>{m.description}</p>
          <p>
            <strong>Amount:</strong> ₹{m.amount}
          </p>
          <p>
            <strong>Due:</strong> {m.dueDate?.split('T')[0]}
          </p>
          <p>
            <strong>Completed:</strong> {m.isCompleted ? 'Yes' : 'No'}
          </p>
          {!m.isCompleted && isFreelancer && contract.status === 'in_progress' && (
            <button
              onClick={() => completeMilestone(idx)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Mark Completed
            </button>
          )}
        </div>
      ))}

      {contract.status === 'pending' && isFreelancer && (
        <div className="mt-6">
          <button
            onClick={() => updateStatus('accepted')}
            className="px-4 py-2 bg-green-600 text-white rounded mr-2 hover:bg-green-700 transition"
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus('cancelled')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <Link to="/contracts" className="inline-block text-blue-600 underline hover:text-blue-800">
          ← Back to Contracts
        </Link>
        {canEdit && (
          <Link to={`/contracts/${id}/edit`} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
            Edit Contract
          </Link>
        )}
      </div>
    </div>
  );
}
