import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Reset Password</h2>

        <label className="text-sm font-medium">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-6"
          placeholder="Enter new password"
          required
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">Reset Password</button>
      </form>
    </div>
  );
}
