import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa';

export default function CreateService() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryTime: '',
    tags: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      images.forEach((image) => {
        formData.append('images', image);
      });

      await API.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Service created successfully!');
      navigate('/freelancer/services');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">Create a New Service</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Service Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., I will create a stunning logo for your business"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your service in detail..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g., Graphic Design, Web Development"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g., 50"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Delivery Time (days)</label>
              <input
                type="number"
                name="deliveryTime"
                value={form.deliveryTime}
                onChange={handleChange}
                placeholder="e.g., 7"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g., react, node.js, tailwindcss"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Service Images</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Service'}
          </button>
        </form>
      </div>
    </div>
  );
}