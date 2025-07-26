import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import API from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await API.post('/auth/google', {
        credential: response.credential,
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('token', res.data.token);
      toast.success('Google login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  useGoogleOneTapLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google One Tap login failed'),
    promptMomentNotification: (notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log('One Tap not displayed:', notification.getNotDisplayedReason());
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>

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

        <label className="text-sm font-medium">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 rounded w-full mb-6"
          required
          autoComplete="current-password"
        />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full">
          Login
        </button>

        <div className="my-6 text-center">
          <p className="text-gray-500 mb-2">OR</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
          />
        </div>

        <div className="text-sm mt-4 text-center space-y-2">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
