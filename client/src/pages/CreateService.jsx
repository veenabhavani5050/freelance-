// src/pages/freelancer/CreateService.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Corrected path to axios instance
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
    skills: '',
    gallery: [{ imageUrl: '' }],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGalleryChange = (index, value) => {
    const newGallery = [...form.gallery];
    newGallery[index].imageUrl = value;
    setForm({ ...form, gallery: newGallery });
  };

  const addGalleryImage = () => {
    setForm({ ...form, gallery: [...form.gallery, { imageUrl: '' }] });
  };

  const removeGalleryImage = (index) => {
    const newGallery = form.gallery.filter((_, i) => i !== index);
    setForm({ ...form, gallery: newGallery });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()),
        gallery: form.gallery.map(g => g.imageUrl),
        price: Number(form.price),
        deliveryTime: Number(form.deliveryTime),
      };

      await API.post('/services', payload);
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
              <label className="block text-gray-700 font-medium mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, TailwindCSS"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Image Gallery</label>
            {form.gallery.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={image.imageUrl}
                  onChange={(e) => handleGalleryChange(index, e.target.value)}
                  placeholder="Paste image URL here"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.gallery.length > 1 && (
                  <button type="button" onClick={() => removeGalleryImage(index)} className="text-red-500 hover:text-red-700 transition">
                    <FaTimesCircle className="w-6 h-6" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addGalleryImage}
              className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium mt-2"
            >
              <FaPlusCircle className="mr-2" /> Add another image
            </button>
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