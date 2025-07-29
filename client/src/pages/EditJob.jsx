// ✅ src/pages/EditJob.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    category: '',
    location: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const { data } = await API.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          title: data.title,
          description: data.description,
          budget: data.budget,
          deadline: data.deadline.split('T')[0],
          category: data.category,
          location: data.location || '',
        });
      } catch (err) {
        toast.error('Failed to load job for editing');
        navigate('/client/jobs');
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      await API.put(`/jobs/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Job updated successfully');
      navigate(`/client/jobs/${id}`);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Edit Job</h2>

        <label className="text-sm font-medium">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-4"
        />

        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-4"
        />

        <label className="text-sm font-medium">Budget</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-4"
        />

        <label className="text-sm font-medium">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-4"
        />

        <label className="text-sm font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select category</option>
          <option value="Web Development">Web Development</option>
          <option value="Design">Design</option>
          <option value="Writing">Writing</option>
          <option value="Marketing">Marketing</option>
        </select>

        <label className="text-sm font-medium">Location (optional)</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-6"
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">
          Update Job
        </button>
      </form>
    </div>
  );
}