import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastContainer } from 'react-toastify';
import { Outlet, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet /> {/* 👈 This renders children routes like Dashboard */}
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
    </div>
  );
};

export default Layout;
