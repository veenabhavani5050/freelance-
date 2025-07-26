// ✅ src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [previewPic, setPreviewPic] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    profilePic: '',
    skills: [],
    location: '',
    portfolioLinks: [],
    availability: 'available',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/profile');
        setUser(res.data);
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          profilePic: res.data.profilePic || '',
          skills: res.data.skills || [],
          location: res.data.location || '',
          portfolioLinks: res.data.portfolioLinks || [],
          availability: res.data.availability || 'available',
        });
        setPreviewPic(res.data.profilePic || '');
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'skills' || name === 'portfolioLinks') {
      setForm({ ...form, [name]: value.split(',').map((item) => item.trim()) });
    } else if (name === 'profilePic' && files?.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewPic(imageUrl);
      setForm({ ...form, profilePic: imageUrl });
    } else {
      setForm({ ...form, [name]: value });
      if (name === 'profilePic') setPreviewPic(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await API.put('/auth/profile', form);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Profile update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-600 text-xl font-medium">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Edit Profile</h2>

        {previewPic && (
          <div className="mb-4 flex justify-center">
            <img src={previewPic} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border" />
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Profile Picture (upload)</label>
        <input type="file" name="profilePic" accept="image/*" onChange={handleChange} className="border p-2 rounded w-full mb-2" />
        <input type="text" name="profilePic" placeholder="Or paste image URL" value={form.profilePic} onChange={handleChange} className="border p-2 rounded w-full mb-4" />

        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full mb-4" required />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full mb-4" required />

        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} className="border p-2 rounded w-full mb-4" rows="3" />

        <label className="block text-sm font-medium mb-1">Location</label>
        <input name="location" value={form.location} onChange={handleChange} className="border p-2 rounded w-full mb-4" />

        <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
        <input name="skills" value={form.skills.join(', ')} onChange={handleChange} className="border p-2 rounded w-full mb-4" />

        <label className="block text-sm font-medium mb-1">Portfolio Links (comma-separated)</label>
        <input name="portfolioLinks" value={form.portfolioLinks.join(', ')} onChange={handleChange} className="border p-2 rounded w-full mb-4" />

        <label className="block text-sm font-medium mb-1">Availability</label>
        <select name="availability" value={form.availability} onChange={handleChange} className="border p-2 rounded w-full mb-6">
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full disabled:opacity-60" disabled={updating}>
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}