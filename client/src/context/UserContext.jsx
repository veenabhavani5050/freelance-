import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  const updateUser = (updatedUserData) => {
    const updatedUserWithToken = { ...updatedUserData, token: user.token };
    localStorage.setItem('user', JSON.stringify(updatedUserWithToken));
    setUser(updatedUserWithToken);
  };

  const value = { user, login, logout, updateUser, loading };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};