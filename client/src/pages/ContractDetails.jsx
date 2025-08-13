// client/src/pages/ContractDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function ContractDetails() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetail() {
      try {
        const { data } = await API.get(`/contracts/${id}`);
        setContract(data);
      } catch {
        toast.error('Failed to load contract details');
      }
    }
    fetchDetail();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await API.patch(`/contracts/${id}/status`, { status: newStatus });
      toast.success('Contract status updated');
      navigate('/contracts');
    } catch {
      toast.error('Update failed');
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
    } catch {
      toast.error('Milestone update failed');
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const isFreelancer = user?._id === contract?.freelancer?._id;

  if (!contract) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">{contract.title}</h2>
      <p><strong>Description:</strong> {contract.description}</p>
      <p><strong>Deadline:</strong> {contract.deadline?.split('T')[0]}</p>
      <p><strong>Total Amount:</strong> ₹{contract.totalAmount}</p>
      <p><strong>Status:</strong> <span className="capitalize">{contract.status.replace('_', ' ')}</span></p>

      {contract.milestones.map((m, idx) => (
        <div key={idx} className="border p-4 rounded">
          <h4 className="font-semibold">{m.title}</h4>
          <p>{m.description}</p>
          <p><strong>Amount:</strong> ₹{m.amount}</p>
          <p><strong>Due:</strong> {m.dueDate?.split('T')[0]}</p>
          <p><strong>Completed:</strong> {m.isCompleted ? 'Yes' : 'No'}</p>
          {!m.isCompleted && isFreelancer && (
            <button
              onClick={() => completeMilestone(idx)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Mark Completed
            </button>
          )}
        </div>
      ))}

      {contract.status === 'pending' && isFreelancer && (
        <div>
          <button
            onClick={() => updateStatus('accepted')}
            className="px-4 py-2 bg-green-600 text-white rounded mr-2"
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus('cancelled')}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      )}
      <Link to="/contracts" className="inline-block mt-6 text-blue-600 underline">← Back to Contracts</Link>
    </div>
  );
}