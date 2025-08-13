// EditContract.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const { data } = await API.get(`/contracts/${id}`);
        setContract(data);
        setMilestones(data.milestones || []);
      } catch (err) {
        toast.error('Failed to load contract');
      }
    };
    fetchContract();
  }, [id]);

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', dueDate: '', amount: '' }]);
  };

  const saveChanges = async () => {
    try {
      await API.put(`/contracts/${id}/milestones`, { milestones });
      toast.success('Contract updated');
      navigate(`/contracts/${id}`);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (!contract) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Contract: {contract.title}</h2>

      <div className="space-y-6">
        {milestones.map((ms, idx) => (
          <div key={idx} className="border p-4 rounded-xl shadow-sm bg-gray-50">
            <input
              type="text"
              placeholder="Milestone Title"
              value={ms.title}
              onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="date"
              value={ms.dueDate}
              onChange={(e) => handleMilestoneChange(idx, 'dueDate', e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={ms.amount}
              onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button
          onClick={addMilestone}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          + Add Milestone
        </button>
        <button
          onClick={saveChanges}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditContract;