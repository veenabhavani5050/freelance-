// ✅ src/pages/CreateService.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateService = () => {
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '', deliveryTime: '', tags: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = form.tags.split(',').map(tag => tag.trim());
      await axios.post('/api/services', { ...form, tags: tagsArray }, { withCredentials: true });
      toast.success('Service created');
      navigate('/services');
    } catch (error) {
      toast.error('Failed to create service');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Create New Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input" required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input" required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="input" required />
        <input name="deliveryTime" type="number" placeholder="Delivery Time (days)" value={form.deliveryTime} onChange={handleChange} className="input" required />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="input" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default CreateService;