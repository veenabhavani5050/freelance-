import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaSignInAlt,
  FaProjectDiagram,
  FaRocket,
  FaMoneyCheckAlt,
  FaRegStar,
  FaBell,
  FaChartBar,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Freelance Marketplace
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light">
          Hire top freelancers or post jobs seamlessly. Fast, secure, and milestone-based payments!
        </p>
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          <Link
            to="/register"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition flex items-center gap-2"
          >
            <FaUserPlus /> Register
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition flex items-center gap-2"
          >
            <FaSignInAlt /> Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<FaProjectDiagram />}
          title="Post Projects"
          description="Clients can post job listings, manage work, and review proposals efficiently."
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <FeatureCard
          icon={<FaRocket />}
          title="Hire Freelancers"
          description="Find verified freelancers with portfolios and hire with milestone contracts."
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <FeatureCard
          icon={<FaMoneyCheckAlt />}
          title="Secure Payments"
          description="Pay safely via integrated payment gateways, with milestones or full project."
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <FeatureCard
          icon={<FaRegStar />}
          title="Reviews & Ratings"
          description="Transparent review system to help you make better hiring decisions."
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <FeatureCard
          icon={<FaBell />}
          title="Real-time Notifications"
          description="Get updates on jobs, contracts, messages, payments, and more instantly."
          bgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <FeatureCard
          icon={<FaChartBar />}
          title="Interactive Dashboard"
          description="Manage services, jobs, contracts, payments, and notifications in one place."
          bgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />
      </section>

      {/* Footer / CTA Section */}
      <footer className="text-center py-10 bg-blue-50 border-t">
        <p className="text-gray-700">
          🚀 Start your freelance journey today —{" "}
          <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
            Sign up now
          </Link>
        </p>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, bgColor, iconColor }) => {
  return (
    <div
      className={`rounded-2xl shadow-md p-6 ${bgColor} hover:shadow-xl transition-all`}
    >
      <div className={`${iconColor} text-4xl mb-4`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default Home;
