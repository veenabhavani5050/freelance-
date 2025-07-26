// src/pages/PostJob.jsx
import React, { useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', formData);
      toast.success('Job posted successfully!');
      navigate('/client/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Post a Job</h2>

        <label className="text-sm font-medium">Job Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter job title"
          value={formData.title}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-4"
        />

        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          placeholder="Describe the job"
          value={formData.description}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-4"
        />

        <label className="text-sm font-medium">Budget</label>
        <input
          type="number"
          name="budget"
          placeholder="Enter budget"
          value={formData.budget}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full mb-6"
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">
          Post Job
        </button>
      </form>
    </div>
  );
}
