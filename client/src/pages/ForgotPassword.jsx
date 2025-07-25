import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/forgot-password', { email });
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Forgot Password</h2>

        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-6"
          placeholder="Enter your email"
          required
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">Send Reset Link</button>
      </form>
    </div>
  );
}
