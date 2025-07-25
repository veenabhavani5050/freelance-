import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      toast.success('Registration successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>

        <label className="text-sm font-medium">Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="border p-2 rounded w-full mb-4" required />

        <label className="text-sm font-medium">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your Email" className="border p-2 rounded w-full mb-4" required />

        <label className="text-sm font-medium">Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded w-full mb-4" required />

        <label className="text-sm font-medium">Role</label>
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 rounded w-full mb-6" required>
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
        </select>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">Register</button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
