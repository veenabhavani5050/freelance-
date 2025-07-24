import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaSignInAlt, FaProjectDiagram, FaRocket } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Freelance Marketplace
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto">
          Connect with top freelancers or post your own projects. Fast, secure, and reliable!
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link
            to="/register"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 flex items-center gap-2"
          >
            <FaUserPlus /> Register
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 flex items-center gap-2"
          >
            <FaSignInAlt /> Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Post Projects */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-blue-500 text-4xl mb-4">
              <FaProjectDiagram />
            </div>
            <h3 className="text-xl font-semibold mb-2">Post Projects</h3>
            <p className="text-gray-600">
              Clients can easily post their job requirements and manage work through milestone-based contracts.
            </p>
          </div>

          {/* Hire Freelancers */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="text-green-500 text-4xl mb-4">
              <FaRocket />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hire Freelancers</h3>
            <p className="text-gray-600">
              Search verified freelancers, check reviews, and hire with full confidence and secure payments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
