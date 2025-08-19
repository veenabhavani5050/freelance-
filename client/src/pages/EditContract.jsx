import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus } from 'react-icons/fa';

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const { data } = await API.get(`/contracts/${id}`);
        setContract(data);
        setMilestones(data.milestones || []);
      } catch (err) {
        toast.error('Failed to load contract');
        navigate('/contracts');
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id, navigate]);

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', dueDate: '', amount: '', description: '' }]);
  };

  const removeMilestone = (idx) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== idx));
    } else {
      toast.error("A contract must have at least one milestone.");
    }
  };

  const saveChanges = async () => {
    try {
      const payload = {
        milestones: milestones.map(m => ({
          ...m,
          amount: Number(m.amount),
        }))
      };
      await API.put(`/contracts/${id}/milestones`, payload);
      toast.success('Contract updated successfully!');
      navigate(`/contracts/${id}`); // Redirect back to the contract details page
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!contract) return <p className="text-center mt-10">Contract not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Contract: {contract.title}</h2>

      <div className="space-y-6">
        {milestones.map((ms, idx) => (
          <div key={idx} className="border p-4 rounded-xl shadow-sm bg-gray-50 flex flex-col gap-2">
            <h4 className="font-semibold text-gray-800 flex justify-between items-center">
              Milestone #{idx + 1}
              <button
                type="button"
                onClick={() => removeMilestone(idx)}
                className="text-red-500 hover:text-red-700 transition"
                disabled={milestones.length === 1}
              >
                <FaTrash />
              </button>
            </h4>
            <input
              type="text"
              placeholder="Milestone Title"
              value={ms.title}
              onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Milestone Description"
              value={ms.description}
              onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
              className="w-full p-2 border rounded"
              rows="2"
            />
            <input
              type="number"
              placeholder="Amount"
              value={ms.amount}
              onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              value={ms.dueDate}
              onChange={(e) => handleMilestoneChange(idx, 'dueDate', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button
          onClick={addMilestone}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 flex items-center gap-2"
        >
          <FaPlus /> Add Milestone
        </button>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigate(`/contracts/${id}`)}
            className="px-4 py-2 text-gray-600 rounded hover:text-gray-900 transition"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContract;