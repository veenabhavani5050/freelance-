import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-center py-6 bg-blue-100 mt-auto border-t">
      <p className="text-gray-700">
        🚀 Start your freelance journey today —{' '}
        <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
          Sign up now
        </Link>
      </p>
    </footer>
  );
};

export default Footer;