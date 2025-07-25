// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function Profile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: '', email: '', bio: '' });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
      setUser(localUser);
      setForm({
        name: localUser.name || '',
        email: localUser.email || '',
        bio: localUser.bio || '',
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/profile', form);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Profile update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Edit Profile</h2>

        <label className="text-sm font-medium">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="border p-2 rounded w-full mb-4"
          required
        />

        <label className="text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="border p-2 rounded w-full mb-4"
          required
        />

        <label className="text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="A short bio about you"
          className="border p-2 rounded w-full mb-6"
          rows="4"
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
