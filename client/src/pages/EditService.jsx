import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';
import {
  FaEdit, FaHeading, FaFileAlt, FaTags,
  FaRupeeSign, FaRegClock, FaListAlt
} from 'react-icons/fa';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryTime: '',
    tags: '',
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await API.get(`/services/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          deliveryTime: data.deliveryTime,
          tags: data.tags?.join(', ') || '',
        });
      } catch (err) {
        toast.error('Failed to load service for editing');
        console.error("Fetch service error:", err);
        navigate('/freelancer/services');
      }
    };
    fetchService();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = new FormData();
      for (const key in formData) {
        updatedFormData.append(key, formData[key]);
      }
      images.forEach((image) => {
        updatedFormData.append('images', image);
      });

      await API.put(`/services/${id}`, updatedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Service updated successfully');
      navigate(`/freelancer/services`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      console.error("Update service error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-yellow-600 mb-6 flex items-center gap-2">
          <FaEdit className="text-yellow-500" /> Edit Service
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <FaHeading className="inline-block mr-1" /> Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <FaListAlt className="inline-block mr-1" /> Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <FaRupeeSign className="inline-block mr-1" /> Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              <FaRegClock className="inline-block mr-1" /> Delivery Time (days)
            </label>
            <input
              type="number"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <FaFileAlt className="inline-block mr-1" /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            <FaTags className="inline-block mr-1" /> Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        
        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Update Images (optional)
          </label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-all"
        >
          Update Service
        </button>
      </form>
    </div>
  );
}