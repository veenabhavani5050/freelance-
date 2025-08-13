// ✅ src/components/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import "react-toastify/dist/ReactToastify.css";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default PublicLayout;
