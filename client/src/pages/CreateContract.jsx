import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaTrash, FaPlus } from 'react-icons/fa';

export default function CreateContract() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [freelancers, setFreelancers] = useState([]);

  const [form, setForm] = useState({
    freelancerId: '',
    title: '',
    description: '',
    deadline: '',
    milestones: [{ title: '', description: '', amount: '', dueDate: '' }],
  });

  useEffect(() => {
    async function fetchData() {
      const storedAuthData = JSON.parse(localStorage.getItem('user') || '{}');
      const storedUser = storedAuthData.user;

      if (!storedAuthData || !storedUser || storedUser.role !== 'client') {
        toast.error('Only clients can create contracts');
        navigate('/contracts');
        return;
      }
      setUser(storedUser);

      try {
        const { data } = await API.get('/freelancers');
        if (Array.isArray(data)) {
          setFreelancers(data);
          if (data.length > 0) {
            setForm(prev => ({ ...prev, freelancerId: data[0]._id }));
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load freelancers');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  const handleMilestoneChange = (idx, field, value) => {
    const updated = [...form.milestones];
    updated[idx][field] = value;
    setForm({ ...form, milestones: updated });
  };

  const addMilestone = () =>
    setForm((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', description: '', amount: '', dueDate: '' }],
    }));

  const removeMilestone = (idx) => {
    if (form.milestones.length > 1) {
      setForm((prev) => ({
        ...prev,
        milestones: prev.milestones.filter((_, i) => i !== idx),
      }));
    } else {
      toast.error("A contract must have at least one milestone.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.freelancerId) {
      toast.error('Please select a freelancer');
      return;
    }

    try {
      const payload = {
        freelancerId: form.freelancerId,
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        milestones: form.milestones.map((m) => ({
          ...m,
          amount: Number(m.amount),
        })),
      };

      // The key change is here: capturing the response from the API call.
      // The response data should contain the new contract object with its ID.
      const { data } = await API.post('/contracts', payload);
      const newContractId = data._id; // Assuming the new contract ID is in data._id

      toast.success('Contract created successfully!');
      // Navigate to the details page of the newly created contract.
      navigate(`/contracts/${newContractId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create contract');
    }
  };

  if (loading) return <Loader message="Loading contract form..." />;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Contract</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Freelancer Selection */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium" htmlFor="freelancerId">
            Select Freelancer
          </label>
          <select
            id="freelancerId"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={form.freelancerId}
            onChange={(e) => setForm({ ...form, freelancerId: e.target.value })}
            required
          >
            {freelancers.length > 0 ? (
              freelancers.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No freelancers available</option>
            )}
          </select>
        </div>

        {/* Other form fields */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            placeholder="Contract Title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            placeholder="Detailed description of the contract"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="4"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Deadline</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Milestones</h3>
        {form.milestones.map((m, idx) => (
          <div key={idx} className="space-y-2 border border-dashed border-gray-400 p-4 rounded-md bg-gray-50">
            <h4 className="font-semibold text-gray-800 flex justify-between items-center">
              Milestone #{idx + 1}
              <button
                type="button"
                onClick={() => removeMilestone(idx)}
                className="text-red-500 hover:text-red-700 transition"
                disabled={form.milestones.length === 1}
              >
                <FaTrash />
              </button>
            </h4>
            <input
              type="text"
              placeholder="Milestone Title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={m.title}
              onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
              required
            />
            <textarea
              placeholder="Milestone Description"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={m.description}
              onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
              rows="2"
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={m.amount}
              onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
              required
            />
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={m.dueDate}
              onChange={(e) => handleMilestoneChange(idx, 'dueDate', e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addMilestone}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition duration-200"
        >
          <FaPlus /> Add another milestone
        </button>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200"
          >
            Submit Contract
          </button>
          <Link
            to="/contracts"
            className="ml-4 text-blue-600 underline hover:text-blue-800 transition duration-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}