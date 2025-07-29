// src/pages/EditService.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const EditService = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '', deliveryTime: '', tags: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/services/${id}`)
      .then(res => {
        const { title, description, category, price, deliveryTime, tags } = res.data;
        setForm({ title, description, category, price, deliveryTime, tags: tags.join(', ') });
      })
      .catch(() => toast.error('Failed to load service'));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = form.tags.split(',').map(tag => tag.trim());
      await axios.put(`/api/services/${id}`, { ...form, tags: tagsArray });
      toast.success('Service updated');
      navigate('/freelancer/services');
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Edit Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} className="input" placeholder="Title" />
        <textarea name="description" value={form.description} onChange={handleChange} className="input" placeholder="Description" />
        <input name="category" value={form.category} onChange={handleChange} className="input" placeholder="Category" />
        <input name="price" type="number" value={form.price} onChange={handleChange} className="input" placeholder="Price" />
        <input name="deliveryTime" type="number" value={form.deliveryTime} onChange={handleChange} className="input" placeholder="Delivery Time (days)" />
        <input name="tags" value={form.tags} onChange={handleChange} className="input" placeholder="Tags (comma-separated)" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditService;
