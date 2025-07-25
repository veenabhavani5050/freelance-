// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Profile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: '', email: '', bio: '' });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
      setUser(localUser);
      setForm({ name: localUser.name, email: localUser.email, bio: localUser.bio || '' });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/auth/profile', form);
      alert('Profile updated!');
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-gray-700">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange}
            className="w-full border p-2 rounded" rows="4" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
