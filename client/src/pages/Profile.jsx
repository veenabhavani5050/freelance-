// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';

// Separate component for the view-only mode
const ProfileView = ({ user, onEdit }) => {
  const firstLetter = user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-32 h-32 rounded-full flex items-center justify-center bg-blue-500 text-white text-6xl font-bold border-4 border-blue-500">
          {firstLetter}
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
      <p className="text-gray-500 text-sm mb-4">{user.email}</p>
      <p className="text-gray-700 text-md mb-6">{user.bio}</p>

      <div className="text-left space-y-2 mb-6">
        {user.location && <p><strong className="text-gray-600">Location:</strong> {user.location}</p>}
        {user.skills && user.skills.length > 0 && (
          <p><strong className="text-gray-600">Skills:</strong> {user.skills.join(', ')}</p>
        )}
        {user.portfolioLinks && user.portfolioLinks.length > 0 && (
          <div>
            <strong className="text-gray-600">Portfolio:</strong>
            <ul className="list-disc list-inside ml-4">
              {user.portfolioLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p><strong className="text-gray-600">Availability:</strong> {user.availability}</p>
      </div>
      <button
        onClick={onEdit}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full"
      >
        Edit Profile
      </button>
    </div>
  );
};

// Your original Profile component, now with editing logic
export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    bio: '',
    skills: [],
    location: '',
    portfolioLinks: [],
    availability: 'available',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to toggle edit mode

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/profile');
        setUser(res.data);
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          skills: res.data.skills || [],
          location: res.data.location || '',
          portfolioLinks: res.data.portfolioLinks || [],
          availability: res.data.availability || 'available',
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills' || name === 'portfolioLinks') {
      setForm({
        ...form,
        [name]: value.split(',').map((item) => item.trim()),
      });
    } else {
      setForm({ ...form, [name]: value });
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
      setIsEditing(false); // Switch back to view mode after a successful update
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Profile update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 text-xl font-medium">
        Loading profile...
      </div>
    );
  }

  // If user data is not available, show a loading/error state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-medium">
        Failed to load user data.
      </div>
    );
  }

  // Renders either the edit form or the view page based on the isEditing state
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Edit Profile
          </h2>

          <div className="mb-4 flex justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-500 text-white text-5xl font-bold border">
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
          </div>

          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
            required
          />

          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
            required
          />

          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
            rows="3"
          />

          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />

          <label className="block text-sm font-medium mb-1">
            Skills (comma-separated)
          </label>
          <input
            name="skills"
            value={form.skills.join(', ')}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />

          <label className="block text-sm font-medium mb-1">
            Portfolio Links (comma-separated)
          </label>
          <input
            name="portfolioLinks"
            value={form.portfolioLinks.join(', ')}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />

          <label className="block text-sm font-medium mb-1">Availability</label>
          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-6"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="busy">Busy</option>
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full disabled:opacity-60"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <ProfileView user={user} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
