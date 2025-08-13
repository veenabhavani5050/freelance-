// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext'; // Import UserProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider> {/* Wrap with UserProvider */}
          <App />
          <ToastContainer position="bottom-right" />
        </UserProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);